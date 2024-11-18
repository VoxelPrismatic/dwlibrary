package htmx

import (
	"dwlibrary/router/fail"
	"dwlibrary/web"
	"dwlibrary/web/admin"
	"dwlibrary/web/common"
	"net/http"
	"strings"
)

func AdminChip(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	if fail.Auth(w, user, fail.ADMIN) {
		return
	}

	if len(path) != 1 {
		http.Error(w, "Bad request\nformat: /htmx/admin-chip/CHIP", http.StatusBadRequest)
		return
	}

	chip := web.GetFirst(admin.AdminChip{Chip: path[0]})

	switch r.Method {
	case "PUT":
		AdminChip_PUT(w, r, user, chip)

	case "POST":
		AdminChip_POST(w, r, user, chip)

	case "DELETE":
		web.Db().Delete(&chip)
		w.Header().Set("HX-Retarget", "#"+chip.Chip)

	case "PATCH":
		fail.Render(w, r, chip.RenderChip_Edit(user))

	case "GET":
		fail.Render(w, r, chip.RenderChip_View(user))

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func AdminChip_PUT(w http.ResponseWriter, r *http.Request, user common.User, chip admin.AdminChip) {
	if fail.Form(w, r) {
		return
	}

	id := strings.ToLower(r.Form.Get("title"))
	chip = web.GetFirst(admin.AdminChip{Chip: id})

	if chip.Chip != "" {
		fail.Render(w, r, chip.RenderTemplate(user, "Duplicate ID"))
		return
	}

	chip.Chip = id
	if !fail.ValidIDs.MatchString(chip.Chip) {
		fail.Render(w, r, chip.RenderTemplate(user, "Invalid ID (a-z, 0-9, _)"))
		return
	}

	chip.Title = id
	chip.Link = "/admin/" + id
	web.Save(&chip)
	fail.Render(w, r, chip.RenderTemplate_Adjacent(user))
}

func AdminChip_POST(w http.ResponseWriter, r *http.Request, user common.User, chip admin.AdminChip) {
	if fail.Form(w, r) {
		return
	}

	chip.Title = r.Form.Get("title")
	chip.Link = r.Form.Get("link")
	chip.Image = r.Form.Get("url")

	web.Save(&chip)

	fail.Render(w, r, chip.RenderChip_View(user))
}
