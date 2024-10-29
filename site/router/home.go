package router

import (
	"dwlibrary/site/data"
	"dwlibrary/site/template"
	"net/http"
)

func HomeRouter(w http.ResponseWriter, r *http.Request) {
	cookies := r.Cookies()

	user := data.UserEntry{}
	for _, cookie := range cookies {
		if cookie.Name == "jwt" {
			db, err := data.Connect()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			db.Model(&user).Where("jwt = ?", cookie.Value).Find(&user)
			break
		}
	}

	err := template.Home(user).Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
