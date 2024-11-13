package web

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func Connect() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("dwlibrary.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	return db
}

var db *gorm.DB = Connect()

func Migrate(model interface{}) bool {
	err := db.AutoMigrate(model)
	if err != nil {
		panic(err)
	}

	return true
}

func GetFirst[T interface{}](filter T) T {
	ret := new(T)
	db.Where(&filter).First(ret)
	return *ret
}

func GetChildren[T interface{}](filter T) []T {
	ret := new([]T)
	db.Where(&filter).Order("`index` ASC").Find(ret)
	return *ret
}

func Db() *gorm.DB {
	return db
}

func Save(model interface{}) {
	result := db.Create(model)
	if result.Error == nil {
		return
	}

	result = db.Model(model).Updates(model)
	if result.Error != nil {
		panic(result.Error)
	}
}
