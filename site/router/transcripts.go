package router

import (
	"dwlibrary/site/data"
	"dwlibrary/site/template"
	"net/http"
	"strconv"
)

func TranscriptsRouter(w http.ResponseWriter, r *http.Request) {
	source := r.URL.Path[len("/transcripts/"):]

	user := AuthUser(w, r)

	db, err := data.Connect()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	query := r.URL.Query()
	page_str := query.Get("page")
	page, _ := strconv.Atoi(page_str)
	search := query.Get("q")
	if page < 1 {
		page = 1
	}

	limit := 50
	offset := (page - 1) * limit

	var links []data.Link
	res := db.Model(&data.Link{})
	if source != "" {
		res = res.Where("series = ?", source)
	}

	var max_pages int64
	res.Count(&max_pages)
	res.Order("date desc").Offset(offset).Limit(limit).Find(&links)

	err = template.TranscriptEpisodeListing(user, page, max_pages, search, links).Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
