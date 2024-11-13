package router

import (
	"dwlibrary/router/fail"
	"dwlibrary/router/htmx"
	"dwlibrary/web/common"
	"io"
	"net/http"
)

func HtmxRouter(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	switch path[0] {
	case "transcript-list":
		// htmx.HtmxTranscriptListingRouter(user, w, r)

	case "login":
		htmx.LoginRouter(w, r, user, path[1:])

	default:
		HtmxRouter_Authed(w, r, user, path[1:])

	}
}

func HtmxRouter_Authed(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	if fail.Auth(w, user, fail.EDITOR) {
		return
	}

	switch path[0] {
	case "home-link":
		htmx.HomeLink(w, r, user, path[1:])

	case "home-card":
		htmx.HomeCard(w, r, user, path[1:])

	case "upload":
		UploadImage(w, r, user, path[1:])

	// case "series-card":
	// 	htmx.HtmxSeriesCardRouter(w, r, user, path[1:])
	// case "series-link":
	// 	htmx.HtmxSeriesLinkRouter(w, r, user, path[1:])
	// case "series-sync":
	// 	htmx.HtmxSeriesSyncRouter(w, r, user, path[1:])
	default:
		w.Header().Set("X-Redirect-Reason", "404: /htmx/"+path[0])
		http.Redirect(w, r, "/", http.StatusPermanentRedirect)
	}
}

func UploadImage(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	if fail.Auth(w, user, fail.ADMIN) {
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseMultipartForm(32 * 1024 * 1024) // 32 MiB
	if err != nil {
		http.Error(w, "ParseMultipartForm(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	files := r.MultipartForm.File["file"]
	if len(files) == 0 {
		http.Error(w, "No files", http.StatusBadRequest)
		return
	}
	if len(files) > 1 {
		http.Error(w, "Too many files", http.StatusBadRequest)
		return
	}

	file, err := files[0].Open()
	if err != nil {
		http.Error(w, "Open(): "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer file.Close()

	file_data, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "ReadAll(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	img := common.ImageUpload{Link: "blob"}
	err = img.SaveBytes(file_data)
	if err != nil {
		http.Error(w, "SaveBytes(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = w.Write([]byte(img.Location))
	if err != nil {
		http.Error(w, "Write(): "+err.Error(), http.StatusInternalServerError)
		return
	}
}
