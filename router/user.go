package router

import (
	"dwlibrary/router/fail"
	"dwlibrary/router/htmx"
	"dwlibrary/web/common"
	"dwlibrary/web/pages"
	"net/http"
)

func UserRouter(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	if len(path) == 0 {
		path = append(path, "")
	}

	switch path[0] {
	case "login":
		LoginRouter(w, r, user, path[1:])

	default:
		if user.Username == "" {
			http.Redirect(w, r, "/user/login", http.StatusTemporaryRedirect)
			return
		}
	}

}

func LoginRouter(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	switch r.Method {
	case "GET":
		w.Header().Set("Set-Cookie", "jwt=nil; path=/")
		fail.Render(w, r, pages.Login("username too short", false))

	case "POST":
		Login_POST(w, r, user)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func Login_POST(w http.ResponseWriter, r *http.Request, user common.User) {
	if fail.Form(w, r) {
		return
	}

	user, err := htmx.ValidateUser(r, user)
	if err != nil {
		fail.Render(w, r, pages.Login(err.Error(), !user.Exists()))
	}

	err = user.GenerateJWT()
	if err != nil {
		fail.Render(w, r, pages.Login(err.Error(), !user.Exists()))
	}

	http.SetCookie(w, user.Cookie())
	http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
}
