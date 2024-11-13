package router

import (
	"net/http"
	"strings"

	"dwlibrary/site/router/htmx"
)

func HtmxRouter(w http.ResponseWriter, r *http.Request) {
	user := AuthUser(w, r)

	source := strings.Split(r.URL.Path[len("/htmx/"):], "/")[0]

	switch source {
	case "transcript-list":
		htmx.HtmxTranscriptListingRouter(user, w, r)
		return
	}

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

	switch source {
	case "home-link":
		htmx.HtmxHomeLinkRouter(user, w, r)
		return
	case "home-card":
		htmx.HtmxHomeCardRouter(user, w, r)
		return
	case "upload":
		htmx.HtmxUploadRouter(user, w, r)
		return
	case "series-card":
		htmx.HtmxSeriesCardRouter(user, w, r)
		return
	case "series-link":
		htmx.HtmxSeriesLinkRouter(user, w, r)
		return
	case "series-sync":
		htmx.HtmxSeriesSyncRouter(user, w, r)
		return
	default:
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
}
