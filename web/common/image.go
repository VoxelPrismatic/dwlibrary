package common

import (
	"bytes"
	"crypto"
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

	"dwlibrary/web"
)

var _ = web.Migrate(ImageUpload{})

type ImageUpload struct {
	Link     string `gorm:"primaryKey"`
	Location string
	Width    int
	Height   int
}

var UPLOAD_PATH = "/src/img/upload/"

func (i *ImageUpload) Exists() bool {
	if i.Location != "" {
		web.Db().Where(i).Find(i)
	}

	if i.Location == "" {
		return false
	}

	loc := strings.ReplaceAll(i.Location, "/src/", "./src/")

	stat, err := os.Stat(loc)
	if err != nil || stat.Size() == 0 {
		return false
	}

	return true
}

func (i *ImageUpload) Download() error {
	if i.Exists() {
		return nil
	}

	resp, err := http.Get(i.Link)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	file_data, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	return i.SaveBytes(file_data)
}

func (i *ImageUpload) to_image(file_data []byte) (image.Image, error) {
	mime := http.DetectContentType(file_data)

	switch mime {
	case "image/jpeg":
		return jpeg.Decode(bytes.NewReader(file_data))
	case "image/png":
		return png.Decode(bytes.NewReader(file_data))
	case "image/webp":
		return webp.Decode(bytes.NewReader(file_data), nil)
	}

	return nil, fmt.Errorf("unsupported format")
}

func (i *ImageUpload) SaveBytes(file_data []byte) error {
	if i.Link == "" {
		return fmt.Errorf("no download link present")
	}

	img, err := i.to_image(file_data)
	if err != nil {
		return err
	}

	out := bytes.NewBuffer(nil)
	err = webp.Encode(out, img, nil)
	if err != nil {
		return err
	}

	file_data = out.Bytes()
	file_size := len(file_data)

	sha512_hash := crypto.SHA512.New()
	_, _ = sha512_hash.Write(file_data)
	sha512 := hex.EncodeToString(sha512_hash.Sum(nil))

	if i.Link == "blob" {
		i.Link = fmt.Sprintf("blob:%s-%d", sha512, file_size)
	}

	file_dir := fmt.Sprintf("%s/%s/%d", sha512[0:2], sha512[2:4], file_size)
	file_name := sha512 + ".webp"
	file_path := fmt.Sprintf("%s/%s", file_dir, file_name)
	dest_path := fmt.Sprintf(".%s%s/", UPLOAD_PATH, file_dir)
	fmt.Println(file_name)

	err = os.MkdirAll(dest_path, 0755)
	if err != nil {
		return err
	}

	err = os.WriteFile(dest_path+file_name, file_data, 0644)
	if err != nil {
		return err
	}

	i.Location = UPLOAD_PATH + file_path
	i.Width = img.Bounds().Max.X
	i.Height = img.Bounds().Max.Y

	web.Save(i)
	return nil
}
