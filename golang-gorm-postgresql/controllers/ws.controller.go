package controllers

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type WebSocketConnection struct {
	Conn *websocket.Conn
}

type WsJsonResponse struct {
	Action      string `json:"action"`
	Message     string `json:"message"`
	MessageType string `json:"message_type"`
}

type WsPayload struct {
	Action  string              `json:"action"`
	Message string              `json:"message"`
	Conn    WebSocketConnection `json:"-"`
}

var WsChan = make(chan WsPayload)

var WsClient = make(map[WebSocketConnection]string)

func WsHandler(c *gin.Context) {
	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println(err)
		return
	}
	var response WsJsonResponse
	response.Message = "Connected to server"
	conn := WebSocketConnection{Conn: ws}
	WsClient[conn] = ""
	err = ws.WriteJSON(response)
	if err != nil {
		log.Println(err)
	}
	go ListenForWs(&conn)
	// go infiniteLoop()
}

func ListenForWs(conn *WebSocketConnection) {
	defer func() {
		if r := recover(); r != nil {
			log.Println("ERROR", fmt.Sprintf("%v", r))
		}
	}()
	var payload WsPayload
	for {
		err := conn.Conn.ReadJSON(&payload)
		if err != nil {
			// do nothing
		} else {
			// fmt.Println("payload"+payload.Message)
			payload.Conn = *conn
			WsChan <- payload
		}
	}
}

func ListenToWsChannel() {
	// var response WsJsonResponse
	for {
		e := <-WsChan
		fmt.Println("received a message")
		fmt.Println(e)
		WSClient := e.Conn
		err := WSClient.Conn.WriteJSON(e)
		if err != nil {
			log.Println(err)
		}
	}
}

// func infiniteLoop() {
// 	count := 1
// 	for {
// 		count++
// 		fmt.Println(count)
// 	}
// }

func BroadcastWs(msg WsPayload) {
	for client := range WsClient {
		err := client.Conn.WriteJSON(msg)
		if err != nil {
			log.Println(err)
		}
	}
}
