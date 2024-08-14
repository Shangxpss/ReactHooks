package routes

import (
	"golang-gorm-postgres/controllers"

	"github.com/gin-gonic/gin"
)

type PersonRouteController struct {
	personController controllers.PersonController
}

func NewRoutePersonController(personController controllers.PersonController) PersonRouteController {
	return PersonRouteController{personController}
}

func (pc *PersonRouteController) PersonRoute(rg *gin.RouterGroup) {
	router := rg.Group("person")
	router.POST("/add", pc.personController.CreatePerson)
	router.GET("/list", pc.personController.FindPersonsName)
	router.PUT("/", pc.personController.UpdatePersonByName)
	router.GET("/", pc.personController.FindAllPersons)
}
