package platform

import (
	"dwlibrary/web"
)

var _ = web.Migrate(Platform{})

type Platform struct {
	Code  string `gorm:"primaryKey"`
	Name  string
	Image string
	Regex string
}

func AllPlatforms() []Platform {
	ret := []Platform{}
	web.Db().Model(&Platform{}).Find(&ret)
	return ret
}
