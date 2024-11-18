package htmx

import (
	"dwlibrary/router/fail"
	"dwlibrary/web"
	"dwlibrary/web/common"
	"dwlibrary/web/home"
	"net/http"
	"strings"
)

func HomeCard(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	if fail.Auth(w, user, fail.ADMIN) {
		return
	}

	if len(path) != 1 {
		http.Error(w, "Bad request\nformat: /htmx/home-card/SHOW", http.StatusBadRequest)
		return
	}

	card := web.GetFirst(home.HomeCard{Show: path[0]})

	switch r.Method {
	case "POST":
		HomeCard_POST(w, r, user, card)

	case "PUT":
		HomeCard_PUT(w, r, user, card)

	case "DELETE":
		web.Db().Delete(&card)
		w.Header().Set("HX-Retarget", "#"+card.Show)

	case "PATCH":
		fail.Render(w, r, card.RenderHead_Edit(user))

	case "GET":
		fail.Render(w, r, card.RenderHead_View(user))

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func HomeCard_POST(w http.ResponseWriter, r *http.Request, user common.User, card home.HomeCard) {
	if fail.Form(w, r) {
		return
	}

	card.Title = r.Form.Get("title")
	card.Desc = r.Form.Get("desc")
	card.Image = r.Form.Get("url")

	web.Save(&card)
	fail.Render(w, r, card.RenderHead_View(user))
}

func HomeCard_PUT(w http.ResponseWriter, r *http.Request, user common.User, card home.HomeCard) {
	if fail.Form(w, r) {
		return
	}

	show := strings.ToLower(r.Form.Get("show"))
	card = web.GetFirst(home.HomeCard{Show: show})

	if card.Show != "" {
		fail.Render(w, r, card.RenderTemplate(user, "Duplicate ID"))
		return
	}

	card.Show = show
	if !fail.ValidIDs.MatchString(card.Show) {
		fail.Render(w, r, card.RenderTemplate(user, "Invalid show ID (a-z, 0-9, _)"))
		return
	}

	card.Title = "The DailyWire Show"
	card.Desc = "Transcripts auto-generated weekly"

	web.Save(&card)
	fail.Render(w, r, card.RenderTemplate_Adjacent(user))
}
