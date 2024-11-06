package router

import (
	"dwlibrary/site/data"
	"dwlibrary/site/template"
	"net/http"
	"strconv"
)

const PAGE_SIZE = 25

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
	filter := query.Get("filter")
	if page < 1 {
		page = 1
	}

	offset := (page - 1) * PAGE_SIZE

	var links []data.Link
	res := db.Model(&data.Link{})
	if source != "" {
		res = res.Where("series = ?", source)
	}
	switch filter {
	case "title":
		res = res.Where("title LIKE ?", "%"+search+"%")
	case "description":
		res = res.Where("description LIKE ?", "%"+search+"%")
	}

	var max_pages int64
	res.Count(&max_pages)
	res.Order("date desc").Offset(offset).Limit(PAGE_SIZE).Find(&links)

	kwargs := template.TranscriptSearchKwargs{
		Page:     page,
		Length:   max_pages,
		PageSize: PAGE_SIZE,
		Query:    search,
		Filter:   filter,
		Show:     source,
		Episodes: links,
	}

	err = template.TranscriptEpisodeListing(user, kwargs).Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
