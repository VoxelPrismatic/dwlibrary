package htmx

import (
	"dwlibrary/router/fail"
	"dwlibrary/web"
	"dwlibrary/web/common"
	"dwlibrary/web/episode"
	"net/http"
	"strings"
)

func AdminSeries(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	if fail.Auth(w, user, fail.ADMIN) {
		return
	}

	if len(path) != 1 {
		http.Error(w, "Bad request\nformat: /htmx/admin-chip/CHIP", http.StatusBadRequest)
		return
	}

	show := web.GetFirst(episode.Show{Code: path[0]})

	switch r.Method {
	case "PUT":
		AdminSeries_PUT(w, r, user, show)

	case "POST":
		AdminSeries_POST(w, r, user, show)

	case "DELETE":
		web.Db().Delete(&show)
		w.Header().Set("HX-Retarget", "#"+show.Code)

	case "PATCH":
		fail.Render(w, r, show.RenderShow_Edit(user))

	case "GET":
		fail.Render(w, r, show.RenderShow(user))

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func AdminSeries_PUT(w http.ResponseWriter, r *http.Request, user common.User, show episode.Show) {
	if fail.Form(w, r) {
		return
	}

	id := strings.ToLower(r.Form.Get("show"))
	show = web.GetFirst(episode.Show{Code: id})

	if show.Code != "" {
		fail.Render(w, r, show.RenderTemplate(user, "Duplicate ID"))
		return
	}

	show.Code = id
	if !fail.ValidIDs.MatchString(show.Code) {
		fail.Render(w, r, show.RenderTemplate(user, "Invalid ID (a-z, 0-9, _)"))
		return
	}

	show.Title = id
	show.Desc = "lorem ipsum dolor sit amet\nmarkdown supported"
	web.Save(&show)
	fail.Render(w, r, show.RenderTemplate_Adjacent(user))
}

func AdminSeries_POST(w http.ResponseWriter, r *http.Request, user common.User, show episode.Show) {
	if fail.Form(w, r) {
		return
	}

	show.Title = r.Form.Get("title")
	show.Desc = r.Form.Get("desc")
	show.Poster = r.Form.Get("poster")
	show.Banner = r.Form.Get("banner")

	web.Save(&show)

	fail.Render(w, r, show.RenderShow(user))
}
