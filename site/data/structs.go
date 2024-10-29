package data

type Link struct {
	Name        string `gorm:"primaryKey"`
	Series      string
	Title       string
	Date        int64
	Description string
	LinkDW      string
	LinkX       string
	LinkYT      string
	Thumb       string
}

type Collection struct {
	Name  string `gorm:"primaryKey"`
	Type  string
	Title string
	Image string
}

type CollectionEntry struct {
	Collection  string `gorm:"foreignKey:Collection;references:Name"`
	Order       int
	Title       string
	Description string
	Image       string
}

type LibraryEntry struct {
	Library     string `gorm:"primaryKey"`
	Title       string `gorm:"primaryKey"`
	Image       string
	Author      string
	Episode     string `gorm:"foreignKey:Library;references:Title"`
	Description string
}

type RecordEntry struct {
	Game            string `gorm:"primaryKey"` // face-off; yes-or-no; etc
	HostName        string `gorm:"primaryKey"`
	ContestantName  string `gorm:"primaryKey"`
	HostScore       int
	ContestantScore int
	Title           string
	Link            string `gorm:"foreignKey:Link;references:Name"`
}

type UserEntry struct {
	Username string `gorm:"primaryKey"`
	Password string
	JWT      string
	IsEditor bool
	IsAdmin  bool
}

type SiteHomeEntry struct {
	Show    string              `gorm:"primaryKey" json:"show"`
	Title   string              `json:"title"`
	Subtext string              `json:"subtext"`
	Image   string              `json:"image"`
	Links   []SiteHomeLinkEntry `json:"links" gorm:"-"`
}

type SiteHomeLinkEntry struct {
	Show      string `gorm:"foreignKey:Show;references:Show"`
	Text      string `json:"text"`
	Link      string `json:"link"`
	Placement int    `json:"placement"`
}

func (e *SiteHomeEntry) GetLinks() []SiteHomeLinkEntry {
	db := ForceConnect()
	var links []SiteHomeLinkEntry
	db.Model(&SiteHomeLinkEntry{}).Where("show = ?", e.Show).Find(&links)
	return links
}
