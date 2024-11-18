package router

import (
	"dwlibrary/router/fail"
	"dwlibrary/web/common"
	"dwlibrary/web/pages"
	"net/http"
)

func AdminRouter(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	if fail.Auth(w, user, fail.ADMIN) {
		return
	}

	switch path[0] {
	case "":
		fail.Render(w, r, pages.Admin(user))

	case "platforms":
		fail.Render(w, r, pages.AdminPlatforms(user))

	default:
		w.Header().Set("X-Redirect-Reason", "404: /admin/"+path[0])
		http.Redirect(w, r, "/", http.StatusPermanentRedirect)

	}
}
