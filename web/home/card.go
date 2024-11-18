package home

import (
	"dwlibrary/web"
)

var _ = web.Migrate(HomeCard{})

type HomeCard struct {
	Show  string `gorm:"primaryKey"`
	Title string
	Desc  string
	Image string
}

func (card HomeCard) Links() []CardLink {
	return web.GetChildren(CardLink{Show: card.Show})
}

func (card HomeCard) NewLink() CardLink {
	l := len(card.Links())
	return CardLink{Show: card.Show, Index: l, HomeCard: card}
}

func AllHomeCards() []HomeCard {
	return web.GetSorted(HomeCard{}, "random()")
}
