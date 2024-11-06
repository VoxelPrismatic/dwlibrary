package htmx

import (
	"dwlibrary/site/data"
	"dwlibrary/site/template"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

const PAGE_SIZE = 25

func HtmxTranscriptListingRouter(user data.UserEntry, w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path[len("/htmx/transcript-list/"):], "/")

	var show string
	var page int
	var filter string
	var search string
	var page_str string

	if r.Method == "GET" {
		if len(parts) < 2 || len(parts) > 3 {
			http.Error(w, "Bad request\nformat: <GET> /transcript-list/SHOW/PAGE/FILTER?q=QUERY", http.StatusBadRequest)
			return
		}

		query := r.URL.Query()
		if len(parts) == 2 {
			show = ""
			page_str = parts[0]
			filter = strings.Split(parts[1], "?")[0]
		} else {
			show = parts[0]
			page_str = parts[1]
			filter = strings.Split(parts[2], "?")[0]
		}
		page, _ = strconv.Atoi(page_str)
		search = query.Get("q")
	} else if r.Method == "PATCH" {
		if len(parts) < 1 || len(parts) > 2 {
			http.Error(w, "Bad request\nformat: <PATCH> /transcript-list/SHOW/FILTER?q=QUERY\nbody\n- page: int", http.StatusBadRequest)
			return
		}
		err := r.ParseForm()
		if err != nil {
			http.Error(w, "Form()"+err.Error(), http.StatusBadRequest)
			return
		}

		query := r.URL.Query()

		if len(parts) == 1 {
			show = ""
			filter = strings.Split(parts[0], "?")[0]
		} else {
			show = parts[0]
			filter = strings.Split(parts[1], "?")[0]
		}

		page_str := r.Form.Get("page")
		page, _ = strconv.Atoi(page_str)
		search = query.Get("q")
	} else if r.Method == "POST" {
		err := r.ParseForm()
		if err != nil {
			http.Error(w, "Form()"+err.Error(), http.StatusBadRequest)
			return
		}

		page = 1
		show = r.Form.Get("show")
		search = r.Form.Get("q")
		filter = r.Form.Get("filter")
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	offset := (page - 1) * PAGE_SIZE
	if page < 1 {
		page = 1
	}

	search = strings.ToLower(search)

	db, err := data.Connect()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var links []data.Link
	res := db.Model(&data.Link{})
	if show != "" {
		res = res.Where("series = ?", show)
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
		Show:     show,
		Episodes: links,
	}

	w.Header().Set("HX-Push-Url", fmt.Sprintf("/transcripts/%s?page=%d&filter=%s&q=%s", show, page, filter, search))
	err = template.TranscriptListEpisodes(kwargs).Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
