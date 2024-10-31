package router

import (
	"bytes"
	"crypto"
	"dwlibrary/site/data"
	"dwlibrary/site/template"
	"encoding/hex"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"net/http"
	"strconv"
	"strings"

	"os"

	"github.com/kolesa-team/go-webp/webp"
)

func HtmxRouter(w http.ResponseWriter, r *http.Request) {
	user := AuthUser(w, r)
	if user.Username == "" {
		w.Header().Set("X-Auth-Reason", "Not logged in")
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}
	if !user.IsEditor {
		w.Header().Set("X-Auth-Reason", "Not an editor")
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	source := strings.Split(r.URL.Path[len("/htmx/"):], "/")[0]

	switch source {
	case "home-link":
		HtmxHomeLinkRouter(user, w, r)
		return
	case "home-card":
		HtmxHomeCardRouter(user, w, r)
		return
	case "upload":
		HtmxUploadRouter(user, w, r)
		return
	default:
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
}

func HtmxUploadRouter(user data.UserEntry, w http.ResponseWriter, r *http.Request) {
	if !user.IsAdmin {
		w.Header().Set("X-Auth-Reason", "Not an admin")
		http.Error(w, "Not authorized", http.StatusUnauthorized)
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

	mime := http.DetectContentType(file_data)
	if !strings.HasPrefix(mime, "image/") {
		http.Error(w, "Not an image", http.StatusBadRequest)
		return
	}

	file_size := len(file_data)

	var img image.Image
	switch mime {
	case "image/jpeg":
		img, err = jpeg.Decode(bytes.NewReader(file_data))
	case "image/png":
		img, err = png.Decode(bytes.NewReader(file_data))
	case "image/webp":
		img, err = webp.Decode(bytes.NewReader(file_data), nil)
	default:
		http.Error(w, "Not a WebP, PNG, or JPEG", http.StatusBadRequest)
		return
	}
	if err != nil {
		http.Error(w, mime+"\nDecode(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	out := bytes.NewBuffer(nil)
	err = webp.Encode(out, img, nil)
	if err != nil {
		http.Error(w, "Encode(): "+err.Error(), http.StatusInternalServerError)
		return
	}
	file_data = out.Bytes()

	sha512_hash := crypto.SHA256.New()
	_, _ = sha512_hash.Write(file_data)
	sha512 := hex.EncodeToString(sha512_hash.Sum(nil))

	file_dir := fmt.Sprintf("/%s/%s/%d", sha512[0:2], sha512[2:4], file_size)
	file_name := sha512 + ".webp"
	file_path := fmt.Sprintf("%s/%s", file_dir, file_name)
	fmt.Println(file_name)

	err = os.MkdirAll("./site/content/upload/"+file_dir, 0755)
	if err != nil {
		http.Error(w, "MkdirAll(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	err = os.WriteFile("./site/content/upload/"+file_path, file_data, 0644)
	if err != nil {
		http.Error(w, "WriteFile(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	_, _ = w.Write([]byte("/src/upload/" + file_path))
}

func HtmxHomeLinkRouter(user data.UserEntry, w http.ResponseWriter, r *http.Request) {
	if !user.IsAdmin {
		w.Header().Set("X-Auth-Reason", "Not an admin")
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(r.URL.Path[len("/htmx/home-link/"):], "/")
	if len(parts) != 2 {
		http.Error(w, "Bad request\nformat: /htmx/home-link/SHOW/INDEX", http.StatusBadRequest)
		return
	}

	show := parts[0]
	index := parts[1]
	db, err := data.Connect()
	if err != nil {
		http.Error(w, "SqlConnect(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	card := data.SiteHomeEntry{}
	db.Model(&data.SiteHomeEntry{}).Where("show = ?", show).Find(&card)

	link := data.SiteHomeLinkEntry{}
	db.Model(&data.SiteHomeLinkEntry{}).Where("show = ? AND placement = ?", show, index).Find(&link)

	maxPlacement := len(card.GetLinks())
	link.Placement, err = strconv.Atoi(index)
	if err != nil {
		link.Placement = maxPlacement
	}

	isNew := link.Placement == maxPlacement

	if r.Method == "PATCH" {
		err := template.EditHomeLink(user, card, link).Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	if r.Method == "POST" {
		err := r.ParseForm()
		if err != nil {
			http.Error(w, "ParseForm(): "+err.Error(), http.StatusInternalServerError)
			return
		}
		link.Show = show
		link.Text = r.Form.Get("text")
		link.Link = r.Form.Get("url")

		fmt.Printf("Link: %+v\n", link)
		db.Save(&link)

		if isNew {
			w.Header().Set("HX-Retarget", "#"+link.Show)
			err = template.HomeCard(user, card).Render(r.Context(), w)
		} else {
			err = template.HomeLink(user, card, link).Render(r.Context(), w)
		}

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	if r.Method == "DELETE" {
		db.Model(&data.SiteHomeLinkEntry{}).Delete(&link)

		placement := 0
		for _, link := range card.GetLinks() {
			link.Placement = placement
			placement++
			db.Save(&link)
		}
		db.Debug().Model(&data.SiteHomeLinkEntry{}).Delete(&data.SiteHomeLinkEntry{Show: show, Placement: placement})

		err = template.HomeCard(user, card).Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	err = template.HomeLink(user, card, link).Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func HtmxHomeCardRouter(user data.UserEntry, w http.ResponseWriter, r *http.Request) {
	if !user.IsAdmin {
		w.Header().Set("X-Auth-Reason", "Not an admin")
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(r.URL.Path[len("/htmx/home-card/"):], "/")
	if len(parts) != 1 {
		http.Error(w, "Bad request\nformat: /htmx/home-card/SHOW", http.StatusBadRequest)
		return
	}

	show := parts[0]
	db, err := data.Connect()
	if err != nil {
		http.Error(w, "SqlConnect(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	card := data.SiteHomeEntry{}
	db.Model(&data.SiteHomeEntry{}).Where("show = ?", show).Find(&card)

	if r.Method == "PATCH" {
		err := template.EditHomeHead(user, card).Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	if r.Method == "POST" {
		err := r.ParseForm()
		if err != nil {
			http.Error(w, "ParseForm(): "+err.Error(), http.StatusInternalServerError)
			return
		}
		card.Title = r.Form.Get("title")
		card.Subtext = r.Form.Get("subtext")
		card.Image = r.Form.Get("url")
		db.Save(&card)
	}

	if r.Method == "PUT" {
		err := r.ParseForm()
		if err != nil {
			http.Error(w, "ParseForm(): "+err.Error(), http.StatusInternalServerError)
			return
		}

		show := strings.ToLower(r.Form.Get("show"))
		old_card := data.SiteHomeEntry{}
		db.Debug().Model(&data.SiteHomeEntry{}).Where("show = ?", show).Find(&old_card)
		if old_card.Show != "" || show == "" {
			err := template.HomeCardTemplate(user).Render(r.Context(), w)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}

		card.Show = show
		card.Title = "The DailyWire Show"
		card.Subtext = "Transcripts auto-generated weekly"
		card.Image = ""
		db.Save(&card)

		err = template.HomeCardPlusTemplate(user, card).Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	if r.Method == "DELETE" {
		db.Model(&data.SiteHomeEntry{}).Delete(&card)
		w.Header().Set("HX-Retarget", "#"+card.Show)
		return
	}

	err = template.HomeHead(user, card).Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
