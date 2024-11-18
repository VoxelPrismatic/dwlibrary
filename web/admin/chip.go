package admin

import (
	"dwlibrary/web"
)

var _ = web.Migrate(AdminChip{})

type AdminChip struct {
	Chip  string `gorm:"primaryKey"`
	Title string
	Image string
	Link  string
}

func AllAdminChips() []AdminChip {
	return web.GetSorted(AdminChip{}, "")
}
