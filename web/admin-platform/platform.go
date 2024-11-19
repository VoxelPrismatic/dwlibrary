package platform

import (
	"dwlibrary/web"
	"regexp"
)

var _ = web.Migrate(Platform{})

type Platform struct {
	Code  string `gorm:"primaryKey"`
	Name  string
	Image string
	Regex string
}

func (p Platform) Match(url string) bool {
	return regexp.MustCompile(p.Regex).MatchString(url)
}

func AllPlatforms() []Platform {
	return web.GetSorted(Platform{}, "")
}
