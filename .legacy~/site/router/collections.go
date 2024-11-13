package router

import (
	"dwlibrary/site/data"
	"net/http"
)

func CollectionsRouter(w http.ResponseWriter, r *http.Request) {
	source := r.URL.Path[len("/collections/"):]

	db, err := data.Connect()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var collections []data.Collection
	db.Model(&data.Collection{}).Where("name = ?", source).Find(&collections)

	if len(collections) == 0 {
		http.Redirect(w, r, "/", http.StatusNotFound)
		return
	}
}
