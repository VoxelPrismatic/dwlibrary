package common

import (
	"crypto"
	"dwlibrary/web"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"net/http"
	"os/exec"
	"regexp"
	"strings"
)

var ValidNames = regexp.MustCompile(`^([0-9a-z\_]+)$`)
var _ = web.Migrate(User{})

type User struct {
	Username string `gorm:"primaryKey"`
	Casing   string
	Password string
	JWT      string
	Editor   bool
	Admin    bool
	GitHash  string
}

func get_git_hash() string {
	cmd := exec.Command("git", "rev-parse", "HEAD")
	out, err := cmd.Output()
	if err != nil {
		panic(err)
	}
	return string(out)
}

func (u User) HashPassword(pass string) string {
	// Generate a number to use as a salt & to make the password more difficult to crack without reading source code
	cycle := uint8(len(u.Username))
	for _, char := range pass {
		cycle <<= 1
		cycle ^= uint8(char)
	}

	if cycle == 0 {
		cycle = uint8(len(u.Username))
	}

	salt := []byte(fmt.Sprintf("%s%d%s", u.Username, cycle, pass))

	// Hash the password [cycle] times
	for i := 0; i < int(cycle); i++ {
		sha256 := crypto.SHA256.New()
		sha256.Write(salt)
		salt = sha256.Sum(nil)
	}

	return hex.EncodeToString(salt)
}

var GIT_HASH string = get_git_hash()

func (u *User) GenerateJWT() error {
	if u.Username == "" || u.Password == "" {
		return fmt.Errorf("missing username or password")
	}

	u.GitHash = GIT_HASH

	check := web.GetFirst(User{Username: u.Username, Password: u.Password})

	if check.Username == "" || check.Username != u.Username {
		return fmt.Errorf("bad credentials")
	}

	u.GitHash = GIT_HASH
	u.JWT = base64.StdEncoding.EncodeToString(
		[]byte(fmt.Sprintf(`{"name":"%s","git":"%s"}`, u.Username, u.GitHash)),
	)

	web.Save(u)
	return nil
}

func (u *User) Exists() bool {
	if u.Username == "" {
		u.Username = u.Casing
	}

	if u.Casing == "" {
		u.Casing = u.Username
	}

	u.Username = strings.ToLower(u.Username)

	check := web.GetFirst(User{Username: u.Username})
	if check.Username == "" {
		return false
	}

	u.Username = check.Username
	u.Casing = check.Casing
	return true
}

func (u *User) ValidateUsername() error {
	if u.Exists() {
		return nil
	}

	if len(u.Username) < 3 {
		return fmt.Errorf("username too short")
	}

	if len(u.Username) > 50 {
		return fmt.Errorf("username too long")
	}

	if !ValidNames.MatchString(u.Username) {
		return fmt.Errorf("username invalid (use an X-like username)")
	}

	return nil
}

func (u *User) ValidatePassword(pass string) error {
	err := u.ValidateUsername()
	if err != nil {
		return err
	}

	u.Password = pass

	if u.Password == "" {
		return fmt.Errorf("password missing")
	}

	if len(u.Password) < 8 {
		return fmt.Errorf("password too short")
	}

	if !u.Exists() {
		return nil
	}

	u.Password = u.HashPassword(pass)
	check := web.GetFirst(User{Username: u.Username, Password: u.Password})
	if check.Username == "" || check.Username != u.Username {
		u.Password = ""
		return fmt.Errorf("bad credentials")
	}

	u.Casing = check.Casing
	u.Admin = check.Admin
	u.Editor = check.Editor
	u.GitHash = GIT_HASH
	u.JWT = check.JWT

	return nil
}

func (u User) Cookie() *http.Cookie {
	return &http.Cookie{
		Name:  "jwt",
		Value: u.JWT,
		Path:  "/",
	}
}

func CookieAuth(w http.ResponseWriter, r *http.Request) User {
	cookies := r.Cookies()
	user := User{}

	for _, cookie := range cookies {
		if cookie.Name != "jwt" {
			continue
		}

		user = web.GetFirst(User{JWT: cookie.Value})
		if user.Username != "" {
			break
		}
	}

	return user
}
