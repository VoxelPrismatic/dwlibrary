package router

import (
	"dwlibrary/site/data"
	"dwlibrary/site/template"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

func HtmxRouter(w http.ResponseWriter, r *http.Request) {
	user := AuthUser(w, r)
	if user.Username == "" {
		w.Header().Set("X-Auth-Reason", "Not logged in")
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}
	if !user.IsEditor {
		w.Header().Set("X-Auth-Reason", "Not an editor")
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	source := strings.Split(r.URL.Path[len("/htmx/"):], "/")[0]

	switch source {
	case "home":
		HtmxHomeRouter(w, r)
		return
	default:
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
}

func HtmxHomeRouter(w http.ResponseWriter, r *http.Request) {
	user := AuthUser(w, r)
	if !user.IsAdmin {
		w.Header().Set("X-Auth-Reason", "Not an admin")
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(r.URL.Path[len("/htmx/home/"):], "/")
	if len(parts) != 2 {
		http.Error(w, "Bad request\nformat: /htmx/home/SHOW/INDEX", http.StatusBadRequest)
		return
	}

	show := parts[0]
	index := parts[1]
	db, err := data.Connect()
	if err != nil {
		http.Error(w, "SqlConnect(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	card := data.SiteHomeEntry{}
	db.Model(&data.SiteHomeEntry{}).Where("show = ?", show).Find(&card)

	link := data.SiteHomeLinkEntry{}
	db.Model(&data.SiteHomeLinkEntry{}).Where("show = ? AND placement = ?", show, index).Find(&link)

	maxPlacement := len(card.GetLinks())
	link.Placement, err = strconv.Atoi(index)
	if err != nil {
		link.Placement = maxPlacement
	}

	isNew := link.Placement == maxPlacement

	if r.Method == "PATCH" {
		err := template.EditHomeLink(user, card, link).Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	if r.Method == "POST" {
		err := r.ParseForm()
		if err != nil {
			http.Error(w, "ParseForm(): "+err.Error(), http.StatusInternalServerError)
			return
		}
		link.Show = show
		link.Text = r.Form.Get("text")
		link.Link = r.Form.Get("url")

		fmt.Printf("Link: %+v\n", link)
		db.Save(&link)

		if isNew {
			w.Header().Set("HX-Retarget", "#"+link.Show)
			err = template.HomeCard(user, card).Render(r.Context(), w)
		} else {
			err = template.HomeLink(user, card, link).Render(r.Context(), w)
		}

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	if r.Method == "DELETE" {
		db.Model(&data.SiteHomeLinkEntry{}).Delete(&link)

		placement := 0
		for _, link := range card.GetLinks() {
			link.Placement = placement
			placement++
			db.Save(&link)
		}
		db.Debug().Model(&data.SiteHomeLinkEntry{}).Delete(&data.SiteHomeLinkEntry{Show: show, Placement: placement})

		err = template.HomeCard(user, card).Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	err = template.HomeLink(user, card, link).Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
