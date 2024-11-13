package htmx

import (
	"dwlibrary/router/fail"
	"dwlibrary/web"
	"dwlibrary/web/common"
	"dwlibrary/web/pages"
	"fmt"
	"net/http"
)

func LoginRouter(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	switch r.Method {
	case "POST":
		Login_POST(w, r, user)

	case "PATCH":
		Login_PATCH(w, r, user)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func ValidateUser(r *http.Request, user common.User) (common.User, error) {
	err := r.ParseForm()
	if err != nil {
		return user, err
	}

	user = common.User{
		Casing: r.Form.Get("username"),
	}

	password := r.Form.Get("password")
	err = user.ValidatePassword(password)
	if err != nil {
		return user, err
	}

	if !user.Exists() {
		check_pw := r.Form.Get("check-pw")
		if password != check_pw {
			return user, fmt.Errorf("passwords don't match")
		}

		user.Password = user.HashPassword(password)
		web.Save(user)
	}

	return user, nil
}

func Login_POST(w http.ResponseWriter, r *http.Request, user common.User) {
	msg := ""
	user, err := ValidateUser(r, user)
	if err != nil {
		msg = err.Error()
	}

	if msg == "passwords don't match" {
		w.Header().Set("HX-Retarget", "#login-btn")
		w.Header().Set("HX-Reswap", "outerHTML")
		fail.Render(w, r, pages.LoginBtn(msg, !user.Exists()))
	} else {
		fail.Render(w, r, pages.LoginBox(msg, !user.Exists()))
	}
}

func Login_PATCH(w http.ResponseWriter, r *http.Request, user common.User) {
	user, err := ValidateUser(r, user)
	if err != nil {
		fail.Render(w, r, pages.LoginBox(err.Error(), !user.Exists()))
	}

	err = user.GenerateJWT()
	if err != nil {
		fail.Render(w, r, pages.Login(err.Error(), !user.Exists()))
	}

	http.SetCookie(w, user.Cookie())
	w.Header().Set("HX-Redirect", "/")
}
