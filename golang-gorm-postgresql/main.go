package main

import (
	"golang-gorm-postgres/controllers"
	"golang-gorm-postgres/initializers"
	"golang-gorm-postgres/routes"
	"log"

	"github.com/gin-gonic/gin"
)

var (
	server              *gin.Engine
	AuthController      controllers.AuthController
	AuthRouteController routes.AuthRouteController

	UserController      controllers.UserController
	UserRouteController routes.UserRouteController

	PostController      controllers.PostController
	PostRouteController routes.PostRouteController

	PersonController      controllers.PersonController
	PersonRouteController routes.PersonRouteController
)

func init() {
	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("? Could not load environment variables", err)
	}

	initializers.ConnectDB(&config)

	AuthController = controllers.NewAuthController(initializers.DB)
	AuthRouteController = routes.NewAuthRouteController(AuthController)

	UserController = controllers.NewUserController(initializers.DB)
	UserRouteController = routes.NewRouteUserController(UserController)

	PostController = controllers.NewPostController(initializers.DB)
	PostRouteController = routes.NewRoutePostController(PostController)

	PersonController = controllers.NewPersonController(initializers.DB)
	PersonRouteController = routes.NewRoutePersonController(PersonController)

	server = gin.Default()
}

func main() {
	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("? Could not load environment variables", err)
	}

	router := server.Group("/api")
	router.GET("/ws", controllers.WsHandler)
	// go controllers.ListenToWsChannel()
	AuthRouteController.AuthRoute(router)
	UserRouteController.UserRoute(router)
	PostRouteController.PostRoute(router)
	PersonRouteController.PersonRoute(router)
	routes.UploadRoute(router)
	log.Fatal(server.Run(":" + config.ServerPort))
}
