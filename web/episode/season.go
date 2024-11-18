package episode

import "dwlibrary/web"

type Show struct {
	Code   string `gorm:"primaryKey"`
	Title  string
	Desc   string
	Banner string
	Poster string
	Host   string
}

type Season struct {
	Show  string `gorm:"primaryKey"`
	Year  int    `gorm:"primaryKey;autoIncrement=false"`
	GqlId string
}

func (s Show) Seasons() []Season {
	return web.GetSorted(Season{Show: s.Code}, "`year` DESC")
}

func (s Show) Episodes() []Episode {
	return web.GetSorted(Episode{Show: s.Code}, "`date` DESC")
}

func AllShows() []Show {
	return web.GetSorted(Show{}, "`title` ASC")
}
