package router

import (
	"dwlibrary/router/fail"
	"dwlibrary/web/common"
	"dwlibrary/web/episode"
	"dwlibrary/web/pages"
	"net/http"
)

func HomeRouter(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	fail.Render(w, r, pages.Home(user))
}

func EpisodeRouter(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	fail.Render(w, r, pages.Episodes(user, episode.EpisodeFilter{}))
}
