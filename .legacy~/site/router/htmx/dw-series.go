package htmx

import (
	"dwlibrary/site/data"
	"dwlibrary/site/template"
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"strings"
)

var valid_ids = regexp.MustCompile(`^([0-9a-z\_]+)$`)

func HtmxSeriesLinkRouter(user data.UserEntry, w http.ResponseWriter, r *http.Request) {
	if !user.IsAdmin {
		w.Header().Set("X-Auth-Reason", "Not an admin")
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(r.URL.Path[len("/htmx/series-link/"):], "/")
	if len(parts) != 2 {
		http.Error(w, "Bad request\nformat: /htmx/series-link/SHOW/INDEX", http.StatusBadRequest)
		return
	}

	show := parts[0]
	index := parts[1]
	db, err := data.Connect()
	if err != nil {
		http.Error(w, "SqlConnect(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	card := data.SiteDwSeriesEntry{}
	db.Model(&card).Where("show = ?", show).Find(&card)

	link := data.SiteDwSeriesLinkEntry{}
	db.Model(&link).Where("show = ? AND placement = ?", show, index).Find(&link)

	maxPlacement := len(card.GetLinks())
	link.Placement, err = strconv.Atoi(index)
	if err != nil {
		link.Placement = maxPlacement
	}

	isNew := link.Placement == maxPlacement

	if r.Method == "PATCH" {
		err := template.EditDwSeriesLink(user, card, link).Render(r.Context(), w)
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
		year, err := strconv.Atoi(r.Form.Get("year"))
		if err != nil {
			http.Error(w, "expected number (got `"+r.Form.Get("year")+"')\nyear: "+err.Error(), http.StatusBadRequest)
			return
		}
		link.Year = year
		link.Link = r.Form.Get("url")

		fmt.Printf("Link: %+v\n", link)
		db.Delete(&data.SiteHomeLinkEntry{Show: link.Show, Placement: link.Placement})
		db.Save(&link)

		if isNew {
			w.Header().Set("HX-Retarget", "#"+link.Show)
			go fill_episodes(link.Link, link.Show)
			err = template.DwSeriesCard(user, card, link.Link).Render(r.Context(), w)
		} else {
			timestamp, ok := syncing[link.Show+"-"+link.Link]
			if !ok {
				timestamp = 0
			}
			sync := timestamp == 0
			err = template.DwSeriesLink(user, card, link, sync).Render(r.Context(), w)
		}

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	if r.Method == "DELETE" {
		db.Model(&data.SiteDwSeriesEntry{}).Delete(&link)

		placement := 0
		for _, link := range card.GetLinks() {
			link.Placement = placement
			placement++
			db.Save(&link)
		}
		db.Model(&data.SiteDwSeriesLinkEntry{}).Delete(&data.SiteDwSeriesLinkEntry{Show: show, Placement: placement})

		err = template.DwSeriesCard(user, card, "").Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	timestamp, ok := syncing[link.Show+"-"+link.Link]
	if !ok {
		timestamp = 0
	}
	sync := timestamp == 0

	err = template.DwSeriesLink(user, card, link, sync).Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func HtmxSeriesCardRouter(user data.UserEntry, w http.ResponseWriter, r *http.Request) {
	if !user.IsAdmin {
		w.Header().Set("X-Auth-Reason", "Not an admin")
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(r.URL.Path[len("/htmx/series-card/"):], "/")
	if len(parts) != 1 {
		http.Error(w, "Bad request\nformat: /htmx/series-card/SHOW", http.StatusBadRequest)
		return
	}

	show := parts[0]
	db, err := data.Connect()
	if err != nil {
		http.Error(w, "SqlConnect(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	card := data.SiteDwSeriesEntry{}
	db.Model(&card).Where("show = ?", show).Find(&card)

	if r.Method == "PATCH" {
		err := template.EditDwSeriesHead(user, card).Render(r.Context(), w)
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
		if !valid_ids.MatchString(show) {
			err := template.DwSeriesCardTemplate(user, "Invalid ID (use only letters, numbers & underscores)").Render(r.Context(), w)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}

		old_card := data.SiteDwSeriesEntry{}
		db.Model(&data.SiteDwSeriesEntry{}).Where("show = ?", show).Find(&old_card)
		if old_card.Show != "" || show == "" {
			err := template.DwSeriesCardTemplate(user, "Duplicate ID").Render(r.Context(), w)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}

		card.Show = show
		card.Title = "The DailyWire Show"
		card.Image = ""
		db.Save(&card)

		err = template.DwSeriesCardPlusTemplate(user, card).Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	if r.Method == "DELETE" {
		db.Model(&data.SiteDwSeriesEntry{}).Delete(&card)
		w.Header().Set("HX-Retarget", "#"+card.Show)
		return
	}

	err = template.DwSeriesHead(user, card).Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
