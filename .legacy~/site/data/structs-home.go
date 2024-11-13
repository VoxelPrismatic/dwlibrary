package data

type SiteHomeEntry struct {
	Show    string              `gorm:"primaryKey" json:"show"`
	Title   string              `json:"title"`
	Subtext string              `json:"subtext"`
	Image   string              `json:"image"`
	Links   []SiteHomeLinkEntry `json:"links" gorm:"-"`
}

type SiteHomeLinkEntry struct {
	Show      string `gorm:"primaryKey" json:"show"`
	Text      string `json:"text"`
	Link      string `json:"link"`
	Placement int    `gorm:"primaryKey;autoIncrement:false" json:"placement"`
}

func (e *SiteHomeEntry) GetLinks() []SiteHomeLinkEntry {
	db := ForceConnect()
	var links []SiteHomeLinkEntry
	db.Model(&SiteHomeLinkEntry{}).Where("show = ?", e.Show).Order("placement ASC").Find(&links)
	return links
}
