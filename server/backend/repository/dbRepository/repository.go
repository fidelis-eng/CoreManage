package dbRepository

import (
	models "a21hc3NpZ25tZW50/model"
	"fmt"

	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

// NewRepository creates a new repository with a GORM database connection.
func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

// User methods
func (r *Repository) AddUser(user models.User) (uint, error) {

	err := r.db.Create(&user).Error
	if err != nil {
		return 0, err
	}
	return user.ID, nil
}

func (r *Repository) GetUserByUsername(username string) (models.User, error) {
	var user models.User
	err := r.db.Where("username = ?", username).First(&user).Error
	if err != nil {
		return models.User{}, err
	}
	return user, nil
}

// GroupTask methods
func (r *Repository) GetAllGroupTasksByOrganizationID(organizationID uint) ([]models.GroupTask, error) {
	var groupTasks []models.GroupTask

	err := r.db.Preload("Tasks.AssignedUsers", func(db *gorm.DB) *gorm.DB {
		return db.Table("users").Select("ID", "name")
	}).Where("organization_id = ?", organizationID).Find(&groupTasks).Error

	if err != nil {
		return nil, err
	}
	return groupTasks, nil
}

func (r *Repository) GetGroupTask(organizationID uint, groupTaskID uint) (*models.GroupTask, error) {
	var groupTask *models.GroupTask
	err := r.db.Where("organization_id = ? AND id = ?", organizationID, groupTaskID).First(&groupTask).Error
	if err != nil {
		return &models.GroupTask{}, err
	}
	return groupTask, nil
}

func (r *Repository) UpdateGroupTask(groupTask *models.GroupTask, input models.GroupTask) (uint, error) {
	groupTask.Title = input.Title
	if err := r.db.Save(&groupTask).Error; err != nil {
		return 0, err
	}
	return groupTask.ID, nil
}

func (r *Repository) AddGroupTask(groupTask models.GroupTask) error {
	err := r.db.Create(&groupTask).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *Repository) DeleteGroupTask(organizationID uint, groupTaskID uint) error {
	err := r.db.Where("organization_id = ? AND id = ?", organizationID, groupTaskID).Delete(&models.GroupTask{}).Error
	if err != nil {
		return err
	}
	return nil
}

// Task methods
func (r *Repository) AddTask(task models.Task) error {
	err := r.db.Create(&task).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *Repository) UpdateTask(task *models.Task, input models.Task) (uint, error) {
	fmt.Println(input)

	// Update task fields
	task.Title = input.Title
	task.Description = input.Description
	task.Deadline = input.Deadline
	task.Status = input.Status
	fmt.Println(task)

	// Start a transaction to ensure atomicity of updates
	tx := r.db.Begin()

	// Ensure the transaction is rolled back on any error
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Table("user_tasks").Where("task_id = ?", task.ID).Delete(&models.UserTasks{}).Error; err != nil {
		tx.Rollback()
		return 0, err
	}

	if err := tx.Model(task).Association("AssignedUsers").Replace(input.AssignedUsers); err != nil {
		tx.Rollback()
		return 0, err
	}
	task.AssignedUsers = []models.User{}

	if err := tx.Save(task).Error; err != nil {
		tx.Rollback()
		return 0, err
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		return 0, err
	}

	return task.ID, nil
}

func (r *Repository) GetTaskByID(taskID uint) (*models.Task, error) {
	var task *models.Task
	err := r.db.Preload("AssignedUsers", func(db *gorm.DB) *gorm.DB {
		return db.Model(&models.User{}).Select("id, name")
	}).First(&task, taskID).Error
	if err != nil {
		return &models.Task{}, err
	}
	return task, nil
}

func (r *Repository) DeleteTask(taskID uint) error {
	err := r.db.Where("id = ?", taskID).Delete(&models.Task{}).Error
	if err != nil {
		return err
	}
	return nil
}

// Organization methods
func (r *Repository) AddOrganizationByUser(user models.User) error {
	var org models.Organization
	org.Name = user.Username
	err := r.db.Create(&org).Error
	if err != nil {
		return err
	}

	var userOrg models.UserOrganizations
	userOrg.OrganizationID = org.ID
	userOrg.UserID = user.ID
	userOrg.OrganizationName = user.Username
	userOrg.UserName = user.Name
	if err := r.db.Create(&userOrg).Error; err != nil {
		return err
	}

	return nil
}

func (r *Repository) GetOrganizationByID(organizationID uint) (models.Organization, error) {
	var organization models.Organization
	err := r.db.Model(models.Organization{}).Where("id = ?", organizationID).Take(&organization).Error
	if err != nil {
		return models.Organization{}, err
	}
	return organization, nil
}

func (r *Repository) DeleteOrganization(organizationID uint) error {
	err := r.db.Where("id = ?", organizationID).Delete(&models.Organization{}).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *Repository) GetAllOrganizationsByUserId(userId uint) ([]models.UserOrganizations, error) {
	var userOrg []models.UserOrganizations
	err := r.db.Table("user_organizations").Select("organization_id, organization_name").Where("user_id = ?", userId).Find(&userOrg).Error
	if err != nil {
		return []models.UserOrganizations{}, err
	}

	return userOrg, nil
}

func (r *Repository) GetAllUsersByOrganizationID(organizationID uint) ([]models.UserSummary, error) {

	var users []models.UserSummary
	err := r.db.Table("user_organizations").
		Select("user_id AS ID, user_name AS name").
		Where("organization_id = ?", organizationID).
		Find(&users).Error

	if err != nil {
		return nil, err
	}

	return users, nil
}
