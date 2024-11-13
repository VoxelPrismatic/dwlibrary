package htmx

import (
	"dwlibrary/router/fail"
	"dwlibrary/web"
	"dwlibrary/web/common"
	"dwlibrary/web/home"
	"fmt"
	"net/http"
	"strconv"
)

func HomeLink(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	if fail.Auth(w, user, fail.ADMIN) {
		return
	}

	if len(path) != 2 {
		http.Error(w, "Bad request\nformat: /htmx/home-link/SHOW/INDEX", http.StatusBadRequest)
		return
	}

	var link home.CardLink
	show := path[0]

	index, err := strconv.Atoi(path[1])
	if err != nil {
		link = web.GetFirst(home.HomeCard{Show: show}).NewLink()
	} else {
		link = web.GetFirst(home.CardLink{Show: show, Index: index})
	}

	if link.Show != show {
		fmt.Println("New link for", show)
		link = web.GetFirst(home.HomeCard{Show: show}).NewLink()
	}

	switch r.Method {
	case "PATCH":
		HomeLink_PATCH(w, r, user, link)

	case "POST":
		HomeLink_POST(w, r, user, link)

	case "DELETE":
		HomeLink_DELETE(w, r, user, link)

	case "GET":
		HomeLink_GET(w, r, user, link)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func HomeLink_PATCH(w http.ResponseWriter, r *http.Request, user common.User, link home.CardLink) {
	fail.Render(w, r, link.RenderLink_Edit(user))
}

func HomeLink_POST(w http.ResponseWriter, r *http.Request, user common.User, link home.CardLink) {
	if fail.Form(w, r) {
		return
	}

	link.Text = r.Form.Get("text")
	link.Link = r.Form.Get("link")

	adj := link.IsNew()
	web.Save(&link)

	if adj {
		fail.Render(w, r, link.RenderTemplate_Adjacent(user))
	} else {
		fail.Render(w, r, link.RenderLink_View(user))
	}
}

func HomeLink_DELETE(w http.ResponseWriter, r *http.Request, user common.User, link home.CardLink) {
	card := link.Card()
	web.Db().Delete(&link)

	idx := 0
	for _, link = range card.Links() {
		link.Index = idx
		web.Save(&link)
		idx++
	}

	web.Db().Delete(&home.CardLink{Show: card.Show, Index: idx})

	fail.Render(w, r, card.RenderCard(user))
}

func HomeLink_GET(w http.ResponseWriter, r *http.Request, user common.User, link home.CardLink) {
	fail.Render(w, r, link.RenderLink_View(user))
}
