package router

import (
	"dwlibrary/router/fail"
	"dwlibrary/router/htmx"
	"dwlibrary/web/common"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func HtmxRouter(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	switch path[0] {
	case "transcript-list":
		// htmx.HtmxTranscriptListingRouter(user, w, r)

	case "login":
		htmx.LoginRouter(w, r, user, path[1:])

	default:
		HtmxRouter_Authed(w, r, user, path)

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

	case "admin-chip":
		htmx.AdminChip(w, r, user, path[1:])

	case "admin-platform":
		htmx.PlatformChip(w, r, user, path[1:])

	case "admin-platform-regex":
		htmx.PlatformRegex(w, r, user, path[1:])

	case "upload-img":
		UploadImage(w, r, user, path[1:])

	case "upload-svg":
		UploadSVG(w, r, user, path[1:])

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

// func read_form(

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

func UploadSVG(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	if fail.Auth(w, user, fail.ADMIN) {
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseMultipartForm(1 * 1024 * 1024) // 1 MiB
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

	mime := http.DetectContentType(file_data)
	fmt.Println(mime)
	if mime != "text/xml; charset=utf-8" {
		http.Error(w, "Not an SVG", http.StatusBadRequest)
		return
	}

	file_str := strings.TrimSpace(string(file_data))
	if !strings.Contains(file_str, "<svg") || !strings.HasSuffix(file_str, "</svg>") {
		http.Error(w, "Not an SVG", http.StatusBadRequest)
		return
	}

	target := strings.ReplaceAll(r.Header.Get("X-Target"), "/", "_")
	name := strings.ReplaceAll(r.Header.Get("X-Name"), "/", "-")
	need_path := r.Header.Get("X-Path")
	dest := "./src/svg/upload/" + target + "/" + name + ".svg"

	err = os.MkdirAll(filepath.Dir(dest), 0755)
	if err != nil {
		http.Error(w, "MkdirAll(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	err = os.WriteFile(dest, file_data, 0644)
	if err != nil {
		http.Error(w, "WriteFile(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	fail.Render(w, r, common.SvgUpload(dest, name, target, need_path == "true"))
}
