package htmx

import (
	"bytes"
	"crypto"
	"dwlibrary/site/data"
	"encoding/hex"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/kolesa-team/go-webp/webp"
)

func HtmxUploadRouter(user data.UserEntry, w http.ResponseWriter, r *http.Request) {
	if !user.IsAdmin {
		w.Header().Set("X-Auth-Reason", "Not an admin")
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	err := r.ParseMultipartForm(32 * 1024 * 1024) // 32 MiB
	if err != nil {
		http.Error(w, "ParseMultipartForm(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	files := r.MultipartForm.File["file"]
	if len(files) == 0 {
		http.Error(w, "No files", http.StatusBadRequest)
		return
	}
	if len(files) > 1 {
		http.Error(w, "Too many files", http.StatusBadRequest)
		return
	}

	file, err := files[0].Open()
	if err != nil {
		http.Error(w, "Open(): "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer file.Close()

	file_data, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "ReadAll(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	mime := http.DetectContentType(file_data)
	if !strings.HasPrefix(mime, "image/") {
		http.Error(w, "Not an image", http.StatusBadRequest)
		return
	}

	file_size := len(file_data)

	var img image.Image
	switch mime {
	case "image/jpeg":
		img, err = jpeg.Decode(bytes.NewReader(file_data))
	case "image/png":
		img, err = png.Decode(bytes.NewReader(file_data))
	case "image/webp":
		img, err = webp.Decode(bytes.NewReader(file_data), nil)
	default:
		http.Error(w, "Not a WebP, PNG, or JPEG", http.StatusBadRequest)
		return
	}
	if err != nil {
		http.Error(w, mime+"\nDecode(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	out := bytes.NewBuffer(nil)
	err = webp.Encode(out, img, nil)
	if err != nil {
		http.Error(w, "Encode(): "+err.Error(), http.StatusInternalServerError)
		return
	}
	file_data = out.Bytes()

	sha512_hash := crypto.SHA256.New()
	_, _ = sha512_hash.Write(file_data)
	sha512 := hex.EncodeToString(sha512_hash.Sum(nil))

	file_dir := fmt.Sprintf("/%s/%s/%d", sha512[0:2], sha512[2:4], file_size)
	file_name := sha512 + ".webp"
	file_path := fmt.Sprintf("%s/%s", file_dir, file_name)
	fmt.Println(file_name)

	err = os.MkdirAll("./site/content/upload/"+file_dir, 0755)
	if err != nil {
		http.Error(w, "MkdirAll(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	err = os.WriteFile("./site/content/upload/"+file_path, file_data, 0644)
	if err != nil {
		http.Error(w, "WriteFile(): "+err.Error(), http.StatusInternalServerError)
		return
	}

	_, _ = w.Write([]byte("/src/upload/" + file_path))
}
