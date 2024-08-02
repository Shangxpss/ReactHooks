package controllers

import (
	"fmt"
	"golang-gorm-postgres/utils"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

type UploadController struct {
}

func CheckChunk(c *gin.Context) {
	hash := c.Query("hash")
	hashPath := fmt.Sprintf("./uploadFile/%s", hash)
	chunkList := []string{}
	isExitsPath, err := utils.PathExists(hashPath)
	fmt.Println("isExitsPath：", isExitsPath)

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
			fileBaseName := strings.Split(fileName, ".")[0]
			if fileBaseName == hash {
				state = 1
			}
		}
		c.JSON(200, gin.H{
			"state":   state,
			"message": chunkList,
		})
	} else {

		c.JSON(200, gin.H{
			"state":   0,
			"message": chunkList,
		})
	}

}

func UploadChunk(c *gin.Context) {
	fileHash := c.PostForm("hash")
	file, err := c.FormFile("file")
	hashPath := fmt.Sprintf("./uploadFile/%s", fileHash)

	if err != nil {
		fmt.Println("获取文件错误", err)
	}

	isExitsPath, err := utils.PathExists(hashPath)
	if err != nil {
		fmt.Println("获取hash值错误", err)
	}

	if !isExitsPath {
		fmt.Println("hashPath:", hashPath)
		os.Mkdir(hashPath, os.ModePerm)
	}

	err = c.SaveUploadedFile(file, fmt.Sprintf("./uploadFile/%s/%s", fileHash, file.Filename))

	if err != nil {
		c.String(400, "上传失败")
		fmt.Println("保存文件错误", err)
	} else {
		chunkList := []string{}

		files, err := os.ReadDir(hashPath)

		if err != nil {
			fmt.Println("文件读取错误", err)
		}
		for _, f := range files {
			fileName := f.Name()
			chunkList = append(chunkList, fileName)
		}
		c.JSON(200, gin.H{
			"chunkList": chunkList,
		})
	}

}

func MergeChunk(c *gin.Context) {
	fmt.Println("合并文件")
	hash := c.Query("hash")
	fileName := c.Query("fileName")
	hashPath := fmt.Sprintf("./uploadFile/%s", hash)

	isExistPath, err := utils.PathExists(hashPath)
	if err != nil {
		fmt.Println("获取hash值错误", err)
	}
	if !isExistPath {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "文件不存在",
		})
		return
	}

	isExistFile, err := utils.PathExists(fmt.Sprintf("%s/%s", hashPath, fileName))

	if err != nil {
		fmt.Println("获取hash值错误", err)
	}

	if isExistFile {
		c.JSON(http.StatusOK, gin.H{
			"fileUrl": fmt.Sprintf("http://localhost:8080/uploadFile/%s/%s", hash, fileName),
		})
		return
	}

	files, err := os.ReadDir(hashPath)
	if err != nil {
		fmt.Println("合并文件读取错误", err)
	}

	compelteFile, err := os.Create(fmt.Sprintf("./uploadFile/%s/%s", hash, fileName))

	if err != nil {
		fmt.Println("创建文件错误", err)
	}

	defer compelteFile.Close()
	if err != nil {
		fmt.Println("创建文件错误", err)
	}

	for _, f := range files {
		fileBuffer, err := os.ReadFile(fmt.Sprintf("./uploadFile/%s/%s", hash, f.Name()))

		if err != nil {
			fmt.Println("读取文件错误", err)
		}
		_, err = compelteFile.Write(fileBuffer)
		if err != nil {
			fmt.Println("写入文件错误", err)
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"fileUrl": fmt.Sprintf("http://localhost:8080/uploadFile/%s/%s", hash, fileName),
	})

}
