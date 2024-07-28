package controllers

import (
	"fmt"
	"golang-gorm-postgres/utils"
	"os"

	"github.com/gin-gonic/gin"
)

func CheckChunk(c *gin.Context) {
	hash := c.Query("hash")
	hashPath := fmt.Sprintf("./uploadFile/%s", hash)
	chunkList := []string{}
	isExitsPath, err := utils.PathExists(hashPath)

	if err != nil {
		fmt.Println("获取hash值错误", err)
	}
	if isExitsPath {
		files, err := os.ReadDir(hashPath)

		state := 0
		if err != nil {
			fmt.Println("文件读取错误", err)
		}
		for _, f := range files {
			fileName := f.Name()
			chunkList = append(chunkList, fileName)
		}
	}

}
