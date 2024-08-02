package routes

import (
	"golang-gorm-postgres/controllers"

	"github.com/gin-gonic/gin"
)

type UploadRouteController struct {
}

func UploadRoute(rg *gin.RouterGroup) {
	router := rg.Group("/upload")
	router.GET("/checkChunk", controllers.CheckChunk)
	router.GET("/mergeChunk", controllers.MergeChunk)
	router.POST("/uploadChunk", controllers.UploadChunk)
}
