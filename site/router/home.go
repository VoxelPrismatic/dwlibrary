package router

import (
	"dwlibrary/site/template"
	"net/http"
)

func HomeRouter(w http.ResponseWriter, r *http.Request) {
	err := template.Home().Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
