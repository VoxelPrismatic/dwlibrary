package main

import (
	"dwlibrary/router"
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("Starting server")
	http.HandleFunc("/", router.Router)

	fmt.Println("Listening on :3000")
	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		panic(err)
	}
}
