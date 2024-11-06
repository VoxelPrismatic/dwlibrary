package data

type SiteDwSeriesEntry struct {
	Show   string `gorm:"primaryKey" json:"show"`
	Title  string `json:"title"`
	Image  string `json:"image"`
	Poster string
	Links  []SiteDwSeriesLinkEntry `json:"links" gorm:"-"`
}

type SiteDwSeriesLinkEntry struct {
	Show      string `gorm:"primaryKey" json:"show"`
	Year      int    `gorm:"primaryKey;autoIncrement:false" json:"year"`
	Link      string `json:"link"`
	Placement int    `json:"placement"`
}

func (e *SiteDwSeriesEntry) GetLinks() []SiteDwSeriesLinkEntry {
	db := ForceConnect()
	var links []SiteDwSeriesLinkEntry
	db.Model(&SiteDwSeriesLinkEntry{}).Where("show = ?", e.Show).Order("year DESC").Find(&links)
	return links
}

func (e *SiteDwSeriesLinkEntry) GetEpisodes() []Link {
	db := ForceConnect()
	var links []Link

	db.Model(&Link{}).Where("graph_ql_series_id = ?", e.Link).Find(&links)
	return links
}
