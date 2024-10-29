package router

import (
	"crypto"
	"dwlibrary/site/data"
	"dwlibrary/site/template"
	"encoding/base64"
	"fmt"
	"net/http"
	"regexp"
	"time"
)

func AuthUser(w http.ResponseWriter, r *http.Request) data.UserEntry {
	cookies := r.Cookies()
	user := data.UserEntry{}
	for _, cookie := range cookies {
		if cookie.Name == "jwt" {
			db, err := data.Connect()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return data.UserEntry{}
			}
			db.Model(&user).Where("jwt = ?", cookie.Value).Find(&user)
			break
		}
	}

	return user
}

func LoginRouter(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		err := template.LoginPage().Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	err := r.ParseForm()
	if err != nil {
		http.Error(w, "ParseForm(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	username := r.Form.Get("username")
	if len(username) < 3 {
		http.Redirect(w, r, "/login?reason=username-too-short", http.StatusBadRequest)
		return
	}
	if len(username) > 50 {
		http.Redirect(w, r, "/login?reason=username-too-long", http.StatusBadRequest)
		return
	}
	if !regexp.MustCompile(`^[a-zA-Z0-9_]+$`).MatchString(username) {
		http.Redirect(w, r, "/login?reason=invalid-username", http.StatusBadRequest)
		return
	}

	password := r.Form.Get("password")
	check_pw := r.Form.Get("check-pw")

	if password != check_pw {
		http.Redirect(w, r, "/login?reason=passwords-dont-match", http.StatusBadRequest)
		return
	}

	hash := crypto.SHA256.New()
	hash.Write([]byte(password))
	pass_hash := string(hash.Sum(nil))
	store_pass := base64.StdEncoding.EncodeToString([]byte(username + ":#:" + pass_hash))

	db, err := data.Connect()
	if err != nil {
		http.Error(w, "DB Connect: "+err.Error(), http.StatusInternalServerError)
		return
	}

	user := data.UserEntry{}
	db.Model(&user).Where("username = ?", username).Where("password = ?", store_pass).Find(&user)

	if user.Username != "" {
		user.JWT = base64.StdEncoding.EncodeToString(
			[]byte(fmt.Sprintf(`{"username":"%s","time":%d}`, username, time.Now().Unix())),
		)
		db.Save(&user)

		cookie := &http.Cookie{
			Name:  "jwt",
			Value: user.JWT,
		}
		http.SetCookie(w, cookie)
	}

	db.Model(&user).Where("username = ?", username).Find(&user)
	if user.Username != "" {
		http.Redirect(w, r, "/login?reason=bad-credentials", http.StatusUnauthorized)
		return
	}

	user.Username = username
	user.Password = store_pass
	user.JWT = base64.StdEncoding.EncodeToString(
		[]byte(fmt.Sprintf(`{"username":"%s","time":%d}`, username, time.Now().Unix())),
	)
	db.Save(&user)
	cookie := &http.Cookie{
		Name:  "jwt",
		Value: user.JWT,
	}
	http.SetCookie(w, cookie)
	http.Redirect(w, r, "/", http.StatusFound)
}
