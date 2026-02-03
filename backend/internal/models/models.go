package models

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/argon2"
	"gorm.io/gorm"
)

// BaseModel defines the common fields for all models.
// It includes an auto-generating UUID, and CreatedAt/UpdatedAt timestamps.
type BaseModel struct {
	ID        string    `gorm:"type:uuid;primaryKey" json:"id"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}

// BeforeCreate is a GORM hook that runs before a new record is created.
// It generates a new UUID for the record's ID if it's not already set.
func (base *BaseModel) BeforeCreate(tx *gorm.DB) error {
	if base.ID == "" {
		newUUID, err := uuid.NewRandom()
		if err != nil {
			return err
		}
		base.ID = newUUID.String()
	}
	return nil
}

type Project struct {
	BaseModel
	Name        string  `gorm:"not null" json:"name"`
	Description string  `json:"description"`
	Key         string  `gorm:"unique;not null" json:"key"`
	OwnerID     string  `gorm:"type:uuid;not null" json:"ownerId"`
	Owner       User    `gorm:"foreignKey:OwnerID" json:"owner"`
	Members     []User  `gorm:"many2many:project_members;" json:"members"`
	Teams       []Team  `gorm:"many2many:project_teams;" json:"teams"`
	Boards      []Board `json:"boards"`
}

type Team struct {
	BaseModel
	Name           string    `gorm:"not null" json:"name"`
	Description    string    `json:"description"`
	Members        []User    `gorm:"many2many:team_members;" json:"members"`
	Projects       []Project `gorm:"many2many:project_teams;" json:"projects"`
	DefaultBoardID *string   `gorm:"type:uuid" json:"defaultBoardId"`
	DefaultBoard   *Board    `gorm:"foreignKey:DefaultBoardID" json:"defaultBoard"`
}

type Board struct {
	BaseModel
	Name      string  `gorm:"not null" json:"name"`
	ProjectID *string `gorm:"type:uuid" json:"projectId"`
	Project   *Project `gorm:"foreignKey:ProjectID" json:"project"`
	TeamID    *string `gorm:"type:uuid" json:"teamId"`
	Team      *Team   `gorm:"foreignKey:TeamID" json:"team"`
	Columns   []Column `json:"columns"`
}

type Column struct {
	BaseModel
	Name     string  `gorm:"not null" json:"name"`
	Position int     `gorm:"not null" json:"position"`
	BoardID  string  `gorm:"type:uuid;not null" json:"boardId"`
	Board    Board   `gorm:"foreignKey:BoardID" json:"board"`
	Issues   []Issue `json:"issues"`
}

type Issue struct {
	BaseModel
	Key         string     `gorm:"not null" json:"key"`
	Title       string     `gorm:"not null" json:"title"`
	Description string     `json:"description"`
	Status      string     `gorm:"not null" json:"status"`
	Priority    string     `gorm:"not null" json:"priority"`
	IssueType   string     `gorm:"not null" json:"issueType"`
	ReporterID  string     `gorm:"type:uuid;not null" json:"reporterId"`
	Reporter    *User      `gorm:"foreignKey:ReporterID" json:"reporter"`
	AssigneeID  *string    `gorm:"type:uuid" json:"assigneeId"`
	Assignee    *User      `gorm:"foreignKey:AssigneeID" json:"assignee,omitempty"`
	ColumnID    string     `gorm:"type:uuid" json:"columnId"`
	Column      *Column    `gorm:"foreignKey:ColumnID" json:"column"`
	ProjectID   string     `gorm:"type:uuid;not null" json:"projectId"`
	Project     *Project   `gorm:"foreignKey:ProjectID" json:"project"`
	Comments    []Comment  `json:"comments"`
	Attachments []Attachment `json:"attachments"`
}

type Comment struct {
	BaseModel
	Content  string `gorm:"not null" json:"content"`
	AuthorID string `gorm:"type:uuid;not null" json:"authorId"`
	Author   User   `gorm:"foreignKey:AuthorID" json:"author"`
	IssueID  string `gorm:"type:uuid;not null" json:"issueId"`
	Issue    Issue  `gorm:"foreignKey:IssueID" json:"issue"`
}

type Attachment struct {
	BaseModel
	URL      string `gorm:"not null" json:"url"`
	Name     string `gorm:"not null" json:"name"`
	Size     int    `json:"size"`
	MimeType string `json:"mimeType"`
	IssueID  string `gorm:"type:uuid;not null" json:"issueId"`
	Issue    Issue  `gorm:"foreignKey:IssueID" json:"issue"`
}

type User struct {
	BaseModel
	Email     string `gorm:"unique;not null" json:"email"`
	Name      string `gorm:"not null" json:"name"`
	Username  string `gorm:"unique;not null" json:"username"`
	Password  string `gorm:"not null" json:"-"`
	AvatarURL string `json:"avatarUrl"`
	Teams     []Team `gorm:"many2many:team_members;" json:"teams"`
}

// GORM Hooks for User model

func (u *User) BeforeCreate(tx *gorm.DB) error {
	// Call the BaseModel's BeforeCreate hook first to generate UUID
	if err := u.BaseModel.BeforeCreate(tx); err != nil {
		return err
	}
	// Hash password before creating user using Argon2
	if u.Password != "" {
		hashedPassword, err := HashPassword(u.Password)
		if err != nil {
			return err
		}
		u.Password = hex.EncodeToString(hashedPassword)
	}
	return nil
}

func (u *User) BeforeUpdate(tx *gorm.DB) error {
	// Hash password before updating user if it changed
	// This hook should be used carefully, as it hashes the password on every update if the field is present.
	if tx.Statement.Changed("Password") && u.Password != "" {
		hashedPassword, err := HashPassword(u.Password)
		if err != nil {
			return err
		}
		u.Password = hex.EncodeToString(hashedPassword)
	}
	return nil
}

// Hashing logic remains the same

func HashPassword(password string) ([]byte, error) {
	time := uint32(3)
	memory := uint32(64 * 1024)
	threads := uint8(4)
	keyLength := uint32(32)
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return nil, err
	}
	hash := argon2.IDKey([]byte(password), salt, time, memory, threads, keyLength)
	result := make([]byte, 16+keyLength)
	copy(result[:16], salt)
	copy(result[16:], hash)
	return result, nil
}

func VerifyPassword(hashedPassword string, password string) error {
	hashBytes, err := hex.DecodeString(hashedPassword)
	if err != nil {
		return fmt.Errorf("failed to decode hash: %v", err)
	}
	if len(hashBytes) < 16 {
		return fmt.Errorf("invalid hash format")
	}
	salt := hashBytes[:16]
	expectedHash := hashBytes[16:]
	time := uint32(3)
	memory := uint32(64 * 1024)
	threads := uint8(4)
	keyLength := uint32(len(expectedHash))
	computedHash := argon2.IDKey([]byte(password), salt, time, memory, threads, keyLength)
	if !bytes.Equal(computedHash, expectedHash) {
		return fmt.Errorf("invalid password")
	}
	return nil
}