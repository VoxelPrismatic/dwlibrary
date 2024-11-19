package htmx

import (
	"dwlibrary/router/fail"
	"dwlibrary/web"
	"dwlibrary/web/common"
	"dwlibrary/web/episode"
	"fmt"
	"net/http"
)

func SeasonSync(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	if fail.Auth(w, user, fail.ADMIN) {
		return
	}

	if len(path) != 1 {
		http.Error(w, "Bad request\nformat: /htmx/season-sync/GQL_ID", http.StatusBadRequest)
		return
	}

	szn := web.GetFirst(episode.Season{GqlId: path[0]})
	show := szn.GetShow()

	switch r.Method {
	case "PATCH":
		go szn.Sync()
		if show.NumSyncing() >= episode.SYNC_MAX {
			w.Header().Set("HX-Retarget", fmt.Sprintf("#%s-table", szn.Show))
			w.Header().Set("HX-Reswap", "outerHTML")
			fail.Render(w, r, show.RenderTable_Sync())
		} else {
			fail.Render(w, r, szn.RenderRow_View(user, true))
		}

	case "GET":
		if show.NumSyncing() >= episode.SYNC_MAX {
			w.Header().Set("HX-Retarget", fmt.Sprintf("#%s-table", szn.Show))
			w.Header().Set("HX-Reswap", "outerHTML")
			fail.Render(w, r, show.RenderTable_Sync())
		} else if szn.Syncing() {
			w.Header().Set("HX-Retarget", fmt.Sprintf("#%s-%d-count", szn.Show, szn.Year))
			w.Header().Set("HX-Reswap", "innerHTML")
			count := len(szn.Episodes())
			if count == 1 {
				_, _ = w.Write([]byte("1 episode"))
			} else {
				_, _ = w.Write([]byte(fmt.Sprintf("%d episodes", count)))
			}
		} else {
			fail.Render(w, r, szn.RenderRow_View(user, false))
		}

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
