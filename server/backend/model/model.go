package models

import (
	"time"

	"gorm.io/gorm"
)

type Organization struct {
	gorm.Model
	Name        string      `json:"name" gorm:"unique"`
	Location    string      `json:"location"`
	Industry    string      `json:"industry"`
	Established string      `json:"established"`
	Employees   int         `json:"employees"`
	Users       []User      `gorm:"many2many:UserOrganizations"`
	GroupTasks  []GroupTask `json:"group_tasks"`
}

type User struct {
	gorm.Model
	Username      string         `json:"username" gorm:"unique"`
	Name          string         `json:"name"`
	Email         string         `json:"email"`
	Password      string         `json:"password"`
	Role          string         `json:"role"`
	Position      string         `json:"position"`
	Department    string         `json:"department"`
	JoinDate      time.Time      `json:"joinDate" gorm:"column:join_date"`
	ProfileImage  string         `json:"profileImage"`
	Phone         string         `json:"phone"`
	AssignedTasks []Task         `gorm:"many2many:UserTasks"`
	Organizations []Organization `gorm:"many2many:UserOrganizations"`
}

type Task struct {
	gorm.Model
	Title         string    `json:"title"`
	Description   string    `json:"desc"`
	Status        string    `json:"status"`
	Deadline      time.Time `json:"deadline"`
	GroupTaskID   uint      `json:"group_task_id"`
	AssignedUsers []User    `gorm:"many2many:UserTasks" json:"assigned_users"`
}

type GroupTask struct {
	gorm.Model
	OrganizationID uint   `json:"organization_id,string"`
	Title          string `json:"title"`
	Tasks          []Task `json:"tasks"`
}

type UserTasks struct {
	UserID   uint   `json:"user_id"`
	TaskID   uint   `json:"task_id"`
	UserName string `json:"user_name"`
}

type UserOrganizations struct {
	UserID           uint   `json:"user_id"`
	OrganizationID   uint   `json:"organization_id"`
	OrganizationName string `json:"organization_name"`
	UserName         string `json:"user_name"`
}

type UserSummary struct {
	ID   uint   `json:"ID"`
	Name string `json:"name"`
}
