package controllers

import (
	"fmt"
	"golang-gorm-postgres/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PersonController struct {
	DB *gorm.DB
}

func NewPersonController(DB *gorm.DB) PersonController {
	return PersonController{DB}
}

// [...] Create Post Handler
func (pc *PersonController) CreatePerson(ctx *gin.Context) {

	var payload *models.CreatePersonRequest

	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, err.Error())
		return
	}

	newPost := models.Person{
		Name:   payload.Name,
		Parent: payload.Parent,
	}

	result := pc.DB.Create(&newPost)
	if result.Error != nil {
		if strings.Contains(result.Error.Error(), "duplicate key") {
			ctx.JSON(http.StatusConflict, gin.H{"status": "fail", "message": "Post with that title already exists"})
			return
		}
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": result.Error.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"status": "success", "data": newPost})
}

// [...] Get Post ById Handler
func (pc *PersonController) FindPersonsName(ctx *gin.Context) {
	parentName := ctx.Query("parentName")
	var person []models.Person
	result := pc.DB.Where("parent = ?", parentName).Find(&person)
	if result.Error != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"status": "fail", "message": "No post with that title exists"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": person})
}

func (pc *PersonController) UpdatePersonByName(ctx *gin.Context) {

	var payload *models.UpdatePersonRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		return
	}
	fmt.Printf("%+v\n", payload)
	var updatedPerson models.Person
	result := pc.DB.First(&updatedPerson, "name = ?", payload.Name)
	if result.Error != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"status": "fail", "message": "No post with that title exists"})
		return
	}

	personToUpdate := models.Person{
		Name:   payload.Name,
		Parent: payload.Parent,
	}
	fmt.Printf("%+v\n", personToUpdate)
	fmt.Printf("%+v\n", updatedPerson)
	pc.DB.Model(&updatedPerson).Updates(personToUpdate)

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": updatedPerson})
}

func (pc *PersonController) FindAllPersons(ctx *gin.Context) {

	var allPerson []models.Person
	results := pc.DB.Find(&allPerson)
	if results.Error != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": results.Error})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": allPerson})
}
