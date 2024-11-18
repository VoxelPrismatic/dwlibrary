package htmx

import (
	"dwlibrary/router/fail"
	"dwlibrary/web"
	platform "dwlibrary/web/admin-platform"
	"dwlibrary/web/common"
	"net/http"
	"regexp"
	"strings"
)

func PlatformRegex(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	if len(path) != 1 {
		http.Error(w, "Bad request\nformat: /htmx/admin-platform-regex/CHIP", http.StatusBadRequest)
		return
	}

	if fail.Form(w, r) {
		return
	}

	chip := web.GetFirst(platform.Platform{Code: path[0]})
	chip.Regex = r.Form.Get("regex")

	_, err := regexp.Compile(chip.Regex)
	fail.Render(w, r, chip.RenderRegex(user, err))
}

func PlatformChip(w http.ResponseWriter, r *http.Request, user common.User, path []string) {
	if fail.Auth(w, user, fail.ADMIN) {
		return
	}

	if len(path) != 1 {
		http.Error(w, "Bad request\nformat: /htmx/admin-platform/CHIP", http.StatusBadRequest)
		return
	}

	chip := web.GetFirst(platform.Platform{Code: path[0]})

	switch r.Method {
	case "PUT":
		PlatformChip_PUT(w, r, user, chip)

	case "POST":
		PlatformChip_POST(w, r, user, chip)

	case "DELETE":
		web.Db().Delete(&chip)
		w.Header().Set("HX-Retarget", "#"+chip.Code)

	case "PATCH":
		fail.Render(w, r, chip.RenderChip_Edit(user))

	case "GET":
		fail.Render(w, r, chip.RenderChip_View(user))

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func PlatformChip_PUT(w http.ResponseWriter, r *http.Request, user common.User, chip platform.Platform) {
	if fail.Form(w, r) {
		return
	}

	id := strings.ToLower(r.Form.Get("title"))
	chip = web.GetFirst(platform.Platform{Code: id})

	if chip.Code != "" {
		fail.Render(w, r, chip.RenderTemplate(user, "Duplicate ID"))
		return
	}

	chip.Code = id
	if !fail.ValidIDs.MatchString(chip.Code) {
		fail.Render(w, r, chip.RenderTemplate(user, "Invalid ID (a-z, 0-9, _)"))
		return
	}

	chip.Name = id
	chip.Regex = ""
	web.Save(&chip)
	fail.Render(w, r, chip.RenderTemplate_Adjacent(user))
}

func PlatformChip_POST(w http.ResponseWriter, r *http.Request, user common.User, chip platform.Platform) {
	if fail.Form(w, r) {
		return
	}

	chip.Name = r.Form.Get("title")
	chip.Regex = r.Form.Get("regex")
	chip.Image = r.Form.Get("url")

	_, err := regexp.Compile(chip.Regex)
	if err != nil {
		w.Header().Set("HX-Retarget", "#"+chip.Code)
		fail.Render(w, r, chip.RenderRegex(user, err))
	}


	web.Save(&chip)
	fail.Render(w, r, chip.RenderChip_View(user))
}
