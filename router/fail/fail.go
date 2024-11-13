package fail

import (
	"dwlibrary/web/common"
	"net/http"
	"regexp"

	"github.com/a-h/templ"
)

const (
	PUBLIC = iota
	VIEWER
	EDITOR
	ADMIN
)

var ValidIDs = regexp.MustCompile(`^([0-9a-z\_\-]+)$`)

func Auth(w http.ResponseWriter, user common.User, level int) bool {
	if level >= VIEWER && user.Username == "" {
		return throw_auth(w, "Not logged in")
	}

	if level >= EDITOR && !(user.Editor || user.Admin) {
		return throw_auth(w, "Not an editor")
	}

	if level >= ADMIN && !user.Admin {
		return throw_auth(w, "Not an admin")
	}

	return false
}

func throw_auth(w http.ResponseWriter, reason string) bool {
	w.Header().Set("X-Auth-Reason", reason)
	http.Error(w, "Not authorized", http.StatusUnauthorized)
	return true
}

func Render(w http.ResponseWriter, r *http.Request, elem templ.Component) {
	err := elem.Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func Form(w http.ResponseWriter, r *http.Request) bool {
	err := r.ParseForm()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return true
	}

	return false
}
