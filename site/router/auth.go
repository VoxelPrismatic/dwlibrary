package router

import (
	"crypto"
	"dwlibrary/site/data"
	"dwlibrary/site/template"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"net/http"
	"os/exec"
	"regexp"
	"strings"
	"time"
)

func getGitHash() string {
	cmd := exec.Command("git", "rev-parse", "HEAD")
	out, err := cmd.Output()
	if err != nil {
		panic(err)
	}
	return string(out)
}

var GIT_HASH string = getGitHash()

func AuthUser(w http.ResponseWriter, r *http.Request) data.UserEntry {
	cookies := r.Cookies()
	user := data.UserEntry{}
	db, err := data.Connect()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return data.UserEntry{}
	}

	for _, cookie := range cookies {
		if cookie.Name == "jwt" {
			db.Model(&user).Where("jwt = ? AND git_hash = ?", cookie.Value, GIT_HASH).Find(&user)
		}
	}

	if user.Username == "" {
		return data.UserEntry{}
	}

	user.GitHash = GIT_HASH
	user.JWT = base64.StdEncoding.EncodeToString(
		[]byte(fmt.Sprintf(`{"username":"%s","time":%d}`, user.Username, time.Now().Unix())),
	)
	db.Save(&user)
	cookie := &http.Cookie{
		Name:  "jwt",
		Value: user.JWT,
		Path:  "/",
	}
	http.SetCookie(w, cookie)

	return user
}

func LoginRouter(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		cookie := &http.Cookie{
			Name:  "jwt",
			Value: "nil",
		}
		http.SetCookie(w, cookie)
		err := template.LoginPage("").Render(r.Context(), w)
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

	username := strings.ToLower(r.Form.Get("username"))
	if len(username) < 3 {
		err := template.LoginPage("Username too short").Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}
	if len(username) > 50 {
		err := template.LoginPage("Username too long").Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}
	if !regexp.MustCompile(`^[a-z0-9_]+$`).MatchString(username) {
		err := template.LoginPage("Invalid username").Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	password := r.Form.Get("password")
	check_pw := r.Form.Get("check-pw")

	if password != check_pw {
		err := template.LoginPage("Passwords don't match").Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	hash := crypto.SHA256.New()
	hash.Write([]byte(password))
	pass_hash := hex.EncodeToString(hash.Sum(nil))
	store_pass := base64.StdEncoding.EncodeToString([]byte(username + ":#:" + pass_hash))

	db, err := data.Connect()
	if err != nil {
		http.Error(w, "DB Connect: "+err.Error(), http.StatusInternalServerError)
		return
	}

	user := data.UserEntry{}
	db.Model(&user).Where("username = ? AND password = ?", username, store_pass).Find(&user)

	// user exists & password is correct
	if user.Username != "" {
		user.GitHash = GIT_HASH
		user.JWT = base64.StdEncoding.EncodeToString(
			[]byte(fmt.Sprintf(`{"username":"%s","time":%d}`, username, time.Now().Unix())),
		)
		db.Save(&user)

		cookie := &http.Cookie{
			Name:  "jwt",
			Value: user.JWT,
		}
		http.SetCookie(w, cookie)

		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	db.Model(&user).Where("username = ?", username).Find(&user)
	if user.Username != "" {
		err := template.LoginPage("Bad credentials").Render(r.Context(), w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	user.Username = username
	user.Password = store_pass
	user.GitHash = GIT_HASH
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
