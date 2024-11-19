package htmx

import (
	"dwlibrary/router/fail"
	"dwlibrary/web"
	"dwlibrary/web/common"
	"dwlibrary/web/episode"
	"net/http"
	"strconv"
)

func AdminSeasons(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	if fail.Auth(w, user, fail.ADMIN) {
		return
	}

	show := web.GetFirst(episode.Show{Code: path[0]})
	if len(path) == 1 {
		AdminSeasons_Szn(w, r, user, show)
		return
	}

	year, err := strconv.Atoi(path[1])
	if err != nil {
		http.Error(w, "Invalid year", http.StatusBadRequest)
		return
	}

	szn := web.GetFirst(episode.Season{Show: show.Code, Year: year})

	switch r.Method {
	case "POST":
		AdminSeasons_POST(w, r, user, show, szn)

	case "DELETE":
		szn := web.GetFirst(episode.Season{Show: show.Code, Year: year})
		web.Db().Delete(&szn)
		fail.Render(w, r, show.RenderTable(user, -1))

	case "PATCH":
		fail.Render(w, r, show.RenderTable(user, year))

	case "GET":
		fail.Render(w, r, show.RenderTable(user, -1))

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func AdminSeasons_Szn(w http.ResponseWriter, r *http.Request, user common.User, show episode.Show) {
	switch r.Method {
	case "PATCH":
		szn := show.NewSeason()
		if !fail.Form(w, r) {
			szn.Year, _ = strconv.Atoi(r.Form.Get("new_year"))
			szn.GqlId = r.Form.Get("new_gql-id")
			szn.Show = show.Code
		}

		web.Save(&szn)

		if szn.Year < 1 || szn.GqlId == "" {
			fail.Render(w, r, show.RenderTable(user, szn.Year))
		} else {
			go szn.Sync()
			fail.Render(w, r, show.RenderTable(user, -1))
		}

	case "POST":
		if show.NumSyncing() >= episode.SYNC_MAX {
			fail.Render(w, r, show.RenderTable_Sync())
			return
		} else {
			fail.Render(w, r, show.RenderTable_Edit(user, -1))
		}

	case "PUT":
		for _, season := range show.Seasons() {
			go season.Sync()
		}
		fail.Render(w, r, show.RenderTable_Sync())

	case "GET":
		fail.Render(w, r, show.RenderTable(user, -1))

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func AdminSeasons_POST(w http.ResponseWriter, r *http.Request, user common.User, show episode.Show, szn episode.Season) {
	if fail.Form(w, r) {
		return
	}

	if szn.Show == "" {
		http.Error(w, "Season not found", http.StatusNotFound)
		return
	}

	year, err := strconv.Atoi(r.Form.Get("year"))
	if err != nil {
		http.Error(w, "Invalid year", http.StatusBadRequest)
		return
	}

	if year < 1 {
		http.Error(w, "Year out of bounds", http.StatusBadRequest)
		return
	}

	web.Db().Delete(&szn)

	gql_id := r.Form.Get("gql-id")
	szns := web.GetSorted(episode.Season{GqlId: gql_id}, "`year` DESC")
	for _, szn := range szns {
		web.Db().Delete(&szn)
	}

	szn.Show = show.Code
	szn.Year = year
	szn.GqlId = gql_id

	web.Save(&szn)

	go szn.Sync()

	fail.Render(w, r, show.RenderTable(user, -1))
}
