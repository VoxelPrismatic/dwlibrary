package main

import (
	"dwlibrary/site/data"
	"dwlibrary/site/router"
	"fmt"
	"net/http"
)

const fill = false

func main() {
	if fill {
		err := data.FillSeries()
		if err != nil {
			panic(err)
		}
	}

	http.HandleFunc("/", router.HomeRouter)
	http.HandleFunc("/api/", router.ApiRouter)
	http.HandleFunc("/htmx/", router.HtmxRouter)
	http.HandleFunc("/login", router.LoginRouter)
	http.HandleFunc("/edit/", router.EditRouter)
	http.HandleFunc("/admin/", router.AdminRouter)
	http.HandleFunc("/collections/", router.CollectionsRouter)
	http.HandleFunc("/transcripts/", router.TranscriptsRouter)
	http.HandleFunc("/src/", router.HandleSource)
	http.HandleFunc("/db/link", router.DatabaseLinkRouter)

	fmt.Println("Listening on :3000")
	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		panic(err)
	}
}
