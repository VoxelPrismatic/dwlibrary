package router

import (
	"fmt"
	"net/http"
	"os"
)

func HandleSource(w http.ResponseWriter, r *http.Request) {
	source := r.URL.Path[len("/src/"):]
	file := fmt.Sprintf("./site/content/%s", source)
	fmt.Println(file)
	stat, err := os.Stat(file)
	if err != nil || stat.Size() == 0 {
		http.Error(w, "Source not found", http.StatusNotFound)
		return
	}
	http.ServeFile(w, r, file)
}
