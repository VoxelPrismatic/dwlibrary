package router

import (
	"dwlibrary/site/data"
	"encoding/json"
	"io"
	"net/http"
	"regexp"
	"strings"
)

func ApiRouter(w http.ResponseWriter, r *http.Request) {
	router := strings.Split(r.URL.Path[len("/api/"):], "/")[0]
	switch router {
	case "login":
		ApiLoginRouter(w, r)
		return

	case "home":
		ApiHomeRouter(w, r)
		return

	default:
		http.Error(w, "Not found", http.StatusNotFound)
	}
}

func ApiLoginRouter(w http.ResponseWriter, r *http.Request) {
	router := strings.Split(r.URL.Path[len("/api/login/"):], "/")[0]
	switch router {
	case "check-username":
		ApiCheckUsername(w, r)
		return

	default:
		http.Error(w, "Not found", http.StatusNotFound)
	}
}

func ApiCheckUsername(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	username := query.Get("username")
	if len(username) < 3 {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"taken":true,"reason":"username-too-short"}`))
		return
	}
	if len(username) > 50 {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"taken":true,"reason":"username-too-long"}`))
		return
	}
	if !regexp.MustCompile(`^[a-zA-Z0-9_]+$`).MatchString(username) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"taken":true,"reason":"invalid-username"}`))
		return
	}

	db, err := data.Connect()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	var user data.UserEntry
	db.Model(&user).Where("username = ?", username).Find(&user)

	if user.Username != "" {
		_, _ = w.Write([]byte(`{"taken":true,"reason":"username-taken"}`))
	} else {
		_, _ = w.Write([]byte(`{"taken":false,"reason":"username-available"}`))
	}
}

func ApiHomeRouter(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	user := AuthUser(w, r)
	if user.Username == "" {
		http.Error(w, "Not authorized\n(need to be logged in)", http.StatusUnauthorized)
		return
	}
	if !user.IsAdmin {
		http.Error(w, "Not authorized\n(need to be site admin)", http.StatusUnauthorized)
		return
	}

	db, err := data.Connect()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	b, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "ReadAll(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	cards := []data.SiteHomeEntry{}
	err = json.Unmarshal(b, &cards)
	if err != nil {
		http.Error(w, "JSON.Unmarshal(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	db.Model(&data.SiteHomeEntry{}).Where("show like ?", "%").Delete(data.SiteHomeEntry{})
	for _, card := range cards {
		db.Save(&card)
		db.Model(&data.SiteHomeLinkEntry{}).Where("show = ?", card.Show).Delete(data.SiteHomeLinkEntry{})
		db.Save(&card.Links)
	}
}
