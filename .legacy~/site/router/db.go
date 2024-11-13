package router

import (
	"dwlibrary/site/data"
	"dwlibrary/site/template"
	"net/http"
	"strconv"
)

func DatabaseLinkRouter(w http.ResponseWriter, r *http.Request) {
	db, err := data.Connect()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if r.Method == "GET" {
		query := r.URL.Query()
		show := query.Get("show")
		page_str := query.Get("p")
		page, _ := strconv.Atoi(page_str)

		var links []data.Link
		db.Model(&links).Where("series = ?", show).Order("date desc").Offset((page - 1) * 50).Limit(50).Find(&links)
		err := template.DbEpisodes(links).Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

	}

	err = r.ParseForm()
	if err != nil {
		http.Error(w, "ParseForm(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	var link data.Link
	link.Name = r.Form.Get("name")
	link.Title = r.Form.Get("title")
	link.Date, _ = strconv.ParseInt(r.Form.Get("date"), 10, 64)
	link.Description = r.Form.Get("description")
	link.LinkDW = r.Form.Get("link_dw")
	link.LinkX = r.Form.Get("link_x")
	link.LinkYT = r.Form.Get("link_yt")
	link.Thumb = r.Form.Get("thumb")
	link.Series = r.Form.Get("series")
	db.Save(&link)
}
