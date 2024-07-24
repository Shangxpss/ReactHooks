package main

import (
	"golang-gorm-postgres/controllers"
	"golang-gorm-postgres/initializers"
	"golang-gorm-postgres/routes"
	"log"
	"strconv"
	"time"

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

	server = gin.Default()
}

func main() {
	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("? Could not load environment variables", err)
	}
	var WsChan = make(chan string)
	go func() {
		var count = 0
		for {
			time.Sleep(time.Second)
			count++
			WsChan <- strconv.Itoa(count)
		}
	}()
	go func() {
		for {

			e := <-WsChan
			println(e)
		}
		// fmt.Println("1")
	}()

	router := server.Group("/api")
	router.GET("/ws", controllers.WsHandler)
	go controllers.ListenToWsChannel()
	AuthRouteController.AuthRoute(router)
	UserRouteController.UserRoute(router)
	PostRouteController.PostRoute(router)
	log.Fatal(server.Run(":" + config.ServerPort))
}
