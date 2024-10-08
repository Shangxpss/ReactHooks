package main

import (
	"fmt"
	"log"

	"golang-gorm-postgres/initializers"
	"golang-gorm-postgres/models"
)

func init() {
	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("? Could not load environment variables", err)
	}

	initializers.ConnectDB(&config)
}

func main() {
	initializers.DB.AutoMigrate(&models.User{}, &models.Post{}, &models.Person{})
	fmt.Println("? Migration complete")
}
