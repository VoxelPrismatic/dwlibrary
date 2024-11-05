package htmx

import (
	"dwlibrary/site/data"
	"dwlibrary/site/template"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

func HtmxHomeLinkRouter(user data.UserEntry, w http.ResponseWriter, r *http.Request) {
	if !user.IsAdmin {
		w.Header().Set("X-Auth-Reason", "Not an admin")
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(r.URL.Path[len("/htmx/home-link/"):], "/")
	if len(parts) != 2 {
		http.Error(w, "Bad request\nformat: /htmx/home-link/SHOW/INDEX", http.StatusBadRequest)
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
	db.Model(&card).Where("show = ?", show).Find(&card)

	link := data.SiteHomeLinkEntry{}
	db.Model(&link).Where("show = ? AND placement = ?", show, index).Find(&link)

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
		db.Delete(&data.SiteHomeLinkEntry{Show: link.Show, Placement: link.Placement})
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
		db.Model(&data.SiteHomeLinkEntry{}).Delete(&data.SiteHomeLinkEntry{Show: show, Placement: placement})

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

func HtmxHomeCardRouter(user data.UserEntry, w http.ResponseWriter, r *http.Request) {
	if !user.IsAdmin {
		w.Header().Set("X-Auth-Reason", "Not an admin")
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(r.URL.Path[len("/htmx/home-card/"):], "/")
	if len(parts) != 1 {
		http.Error(w, "Bad request\nformat: /htmx/home-card/SHOW", http.StatusBadRequest)
		return
	}

	show := parts[0]
	db, err := data.Connect()
	if err != nil {
		http.Error(w, "SqlConnect(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	card := data.SiteHomeEntry{}
	db.Model(&card).Where("show = ?", show).Find(&card)

	if r.Method == "PATCH" {
		err := template.EditHomeHead(user, card).Render(r.Context(), w)
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
		card.Title = r.Form.Get("title")
		card.Subtext = r.Form.Get("subtext")
		card.Image = r.Form.Get("url")
		db.Save(&card)
	}

	if r.Method == "PUT" {
		err := r.ParseForm()
		if err != nil {
			http.Error(w, "ParseForm(): "+err.Error(), http.StatusInternalServerError)
			return
		}

		show := strings.ToLower(r.Form.Get("show"))
		old_card := data.SiteHomeEntry{}
		db.Debug().Model(&data.SiteHomeEntry{}).Where("show = ?", show).Find(&old_card)
		if old_card.Show != "" || show == "" {
			err := template.HomeCardTemplate(user).Render(r.Context(), w)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}

		card.Show = show
		card.Title = "The DailyWire Show"
		card.Subtext = "Transcripts auto-generated weekly"
		card.Image = ""
		db.Save(&card)

		err = template.HomeCardPlusTemplate(user, card).Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	if r.Method == "DELETE" {
		db.Model(&data.SiteHomeEntry{}).Delete(&card)
		w.Header().Set("HX-Retarget", "#"+card.Show)
		return
	}

	err = template.HomeHead(user, card).Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
