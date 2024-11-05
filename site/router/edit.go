package router

import (
	"dwlibrary/site/template"
	"net/http"
	"strings"

	"github.com/a-h/templ"
)

func EditRouter(w http.ResponseWriter, r *http.Request) {
	user := AuthUser(w, r)
	if !user.IsEditor {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	source := strings.Split(r.URL.Path[len("/edit/"):], "/")[0]

	var module templ.Component
	switch source {
	default:
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	err := module.Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func AdminRouter(w http.ResponseWriter, r *http.Request) {
	user := AuthUser(w, r)
	if !user.IsAdmin {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	source := strings.Split(r.URL.Path[len("/admin/"):], "/")[0]

	var module templ.Component
	switch source {
	case "series":
		module = template.DwSeries(user)
	default:
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	err := module.Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
