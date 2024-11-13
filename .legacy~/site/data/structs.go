package data

type Link struct {
	Name            string `gorm:"primaryKey"`
	Series          string
	GraphQLSeriesID string
	Title           string
	Date            int64
	Description     string
	LinkDW          string // DailyWire link
	LinkX           string // Link to X.com
	LinkYT          string // YouTube link
	LinkRUM         string // Rumble link
	Thumb           string
}

func (l *Link) GetSeries() SiteDwSeriesEntry {
	ret := SiteDwSeriesEntry{}
	db, err := Connect()
	if err != nil {
		return ret
	}

	db.Model(&ret).Where("show = ?", l.Series).Find(&ret)
	return ret
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
	GitHash  string
	IsEditor bool
	IsAdmin  bool
}

type SeriesEntry struct {
	Show string `gorm:"primaryKey" json:"show"`
	Name string `json:"name"`
}

type DWSeason struct {
	Show   string `gorm:"foreignKey:Show;references:ShowEntry" json:"show"`
	Season string `json:"season"`
	Year   int    `json:"year"`
}

type TranscriptEntry struct {
	Show    string `gorm:"foreignKey:Show;references:Show" json:"show"`
	Episode string `json:"episode"`
	Segment string `json:"segment"`
	Text    string `json:"text"`
}
