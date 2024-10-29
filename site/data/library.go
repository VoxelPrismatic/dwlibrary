package data

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

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
		&UserEntry{},
		&SiteHomeEntry{},
		&SiteHomeLinkEntry{},
	)

	if err != nil {
		return nil, err
	}

	return db, nil
}

func ForceConnect() *gorm.DB {
	if local_db != nil {
		return local_db
	}

	db, err := Connect()
	if err != nil {
		panic(err)
	}
	return db
}
