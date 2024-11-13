package home

import (
	"dwlibrary/web"
)

type CardLink struct {
	Show     string `gorm:"primaryKey;"`
	Index    int    `gorm:"primaryKey;autoIncrement:false"`
	Link     string
	Text     string
	HomeCard HomeCard `gorm:"foreignKey:Show"`
}

func (link CardLink) Card() HomeCard {
	return web.GetFirst(HomeCard{Show: link.Show})
}

func (link CardLink) IsNew() bool {
	return link.Index >= len(link.Card().Links())
}

var _ = web.Migrate(CardLink{})
