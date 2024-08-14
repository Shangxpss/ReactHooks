package models

import (
	"github.com/google/uuid"
)

type Person struct {
	ID     uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primary_key" json:"id,omitempty"`
	Name   string    `gorm:"uniqueIndex;not null" json:"name,omitempty"`
	Parent string    `gorm:"" json:"parent,omitempty"`
}

type CreatePersonRequest struct {
	Name   string `json:"name" binding:"required"`
	Parent string `json:"parent" binding:"required"`
}

type UpdatePersonRequest struct {
	Name   string `json:"name" binding:"required"`
	Parent string `json:"parent"`
}
