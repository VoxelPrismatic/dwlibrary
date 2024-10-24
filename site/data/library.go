package data

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

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

var local_db *gorm.DB = nil

func Connect() (*gorm.DB, error) {
	if local_db != nil {
		return local_db, nil
	}

	db, err := gorm.Open(sqlite.Open("library.db"), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(
		&Link{},
		&Collection{},
		&CollectionEntry{},
		&LibraryEntry{},
		&RecordEntry{},
	)

	if err != nil {
		return nil, err
	}

	return db, nil
}
