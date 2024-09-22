package main

import (
	model "a21hc3NpZ25tZW50/model"
	"a21hc3NpZ25tZW50/repository/authRepository"
	"a21hc3NpZ25tZW50/repository/dbRepository"
	"net/http"
	"os"

	"a21hc3NpZ25tZW50/service"
	_ "embed"
	"fmt"
	"log"
	"strings"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Credential struct {
	Host         string
	Username     string
	Password     string
	DatabaseName string
	Port         int
	Schema       string
}

func AuthMiddleware(authRepo *authRepository.Repository) gin.HandlerFunc {

	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
			c.Abort()
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := authRepo.ValidJWT(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Unauthorized",
				"error":   err.Error(),
			})
			c.Abort()
			return
		}
		c.Set("userId", claims.UserId)
		c.Set("username", claims.Username)

		c.Next()
	}
}

func Connect(creds *Credential) (*gorm.DB, error) {
	// this is only an example, please modify it to your need
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=disable TimeZone=Asia/Jakarta", creds.Host, creds.Username, creds.Password, creds.DatabaseName, creds.Port)

	// connect using gorm
	dbConn, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger:      logger.Default.LogMode(logger.Silent),
		QueryFields: true,
	})
	if err != nil {
		return nil, err
	}

	return dbConn, nil
}

func SetupRouter(dbRepo *dbRepository.Repository, authRepo *authRepository.Repository) *gin.Engine {
	svc := service.NewService(*dbRepo, authRepo)

	router := gin.Default()

	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	router.GET("/health", func(c *gin.Context) {
		c.String(http.StatusOK, "OK")
	})
	router.GET("/validationtoken", func(c *gin.Context) {
		var tokenString string

		if err := c.ShouldBindJSON(&tokenString); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		data, err := authRepo.ValidJWT(tokenString)
		if err != nil || data == nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Unauthorized",
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"token": tokenString,
		})
	})
	router.POST("/users", func(c *gin.Context) {
		var user model.User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		err_regis := svc.Register(user)
		if err_regis != nil && err_regis.Error() == "username already registered" {
			c.JSON(http.StatusConflict, gin.H{"error": err_regis.Error()})
			return
		}
		if err_regis != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err_regis.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"Message": "New user has been created",
		})
	})

	router.POST("/signin", func(c *gin.Context) {
		var user model.User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		tokenString, err := svc.Login(user.Username, user.Password)
		if err != nil && err.Error() != "user already login" || tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error(), "message": "Invalid username or password"})
			return
		}

		// c.SetCookie("token", tokenString, 3600, "/", "localhost", false, true)
		c.JSON(http.StatusOK, gin.H{
			"status": "Logged in",
			"User":   fmt.Sprintf("%s successfully logged in", user.Username),
			"token":  tokenString,
		})
	})

	protected := router.Group("/")
	protected.Use(AuthMiddleware(authRepo))
	{
		protected.GET("/organizations", func(c *gin.Context) {

			userIdVal := c.MustGet("userId")
			var userId uint

			userId, ok := userIdVal.(uint)
			if !ok {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
				return
			}

			organizations, err := dbRepo.GetAllOrganizationsByUserId(userId)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			c.JSON(http.StatusOK, organizations)
		})

		protected.GET("/:orgId/users", func(c *gin.Context) {
			orgIdStr := c.Param("orgId")
			var orgId uint

			if _, err := fmt.Sscanf(orgIdStr, "%d", &orgId); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
			}

			users, err := dbRepo.GetAllUsersByOrganizationID(orgId)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			c.JSON(http.StatusOK, users)
		})

		// kick user
		// invite/add user to organizations

		protected.GET("/:orgId/grouptasks", func(c *gin.Context) {
			orgIdStr := c.Param("orgId")
			var orgId uint

			if _, err := fmt.Sscanf(orgIdStr, "%d", &orgId); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
			}

			groupTasks, err := dbRepo.GetAllGroupTasksByOrganizationID(orgId)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			if len(groupTasks) == 0 {
				c.JSON(http.StatusNotFound, groupTasks)
				return
			}

			c.JSON(http.StatusOK, groupTasks)
		})

		protected.POST("/:orgId/grouptasks", func(c *gin.Context) {
			orgIdStr := c.Param("orgId")
			var orgId uint
			if _, err := fmt.Sscanf(orgIdStr, "%d", &orgId); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Organization ID format"})
				return
			}
			var groupTask model.GroupTask
			if err := c.ShouldBindJSON(&groupTask); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			groupTask.OrganizationID = orgId
			if err := dbRepo.AddGroupTask(groupTask); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusCreated, gin.H{
				"Message": "New group task has been created",
			})

		})

		protected.PUT("/:orgId/grouptasks/:id", func(c *gin.Context) {
			orgIdStr := c.Param("orgId")
			idStr := c.Param("id")

			var orgId, id uint
			if _, err := fmt.Sscanf(orgIdStr, "%d", &orgId); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Organization ID format"})
				return
			}
			if _, err := fmt.Sscanf(idStr, "%d", &id); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Group Task ID format"})
				return
			}

			var input model.GroupTask
			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			groupTask, err := dbRepo.GetGroupTask(orgId, id)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			if groupTask == nil {
				c.JSON(http.StatusNotFound, "Not Found")
				return
			}

			groupTaskID, err := dbRepo.UpdateGroupTask(groupTask, input)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"status":  "Error",
					"message": err.Error(),
				})
				return
			}
			c.JSON(http.StatusOK, gin.H{
				"status":  "success",
				"message": "successfully update group task",
				"id":      groupTaskID,
			})
		})

		protected.DELETE("/:orgId/grouptasks/:id", func(c *gin.Context) {
			orgIdStr := c.Param("orgId")
			idStr := c.Param("id")

			var orgId, id uint
			if _, err := fmt.Sscanf(orgIdStr, "%d", &orgId); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Organization ID format"})
				return
			}
			if _, err := fmt.Sscanf(idStr, "%d", &id); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Group Task ID format"})
				return
			}

			groupTask, err := dbRepo.GetGroupTask(orgId, id)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			if groupTask == nil {
				c.JSON(http.StatusNotFound, "Not Found")
				return
			}

			if err := dbRepo.DeleteGroupTask(orgId, id); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"status":  "error",
					"message": err.Error(),
				})
				return
			}
			c.String(http.StatusOK, "Group task deleted")

		})

		protected.POST("/tasks", func(c *gin.Context) {
			var task model.Task
			if err := c.ShouldBindJSON(&task); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			if err := dbRepo.AddTask(task); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusCreated, gin.H{
				"Message": "Task has been created",
			})

		})

		protected.GET("/tasks/:id", func(c *gin.Context) {
			idStr := c.Param("id")
			var id uint
			if _, err := fmt.Sscanf(idStr, "%d", &id); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Group Task ID format"})
				return
			}
			task, err := dbRepo.GetTaskByID(id)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			if task == nil {
				c.JSON(http.StatusNotFound, gin.H{"message": "Task not found"})
				return
			}

			c.JSON(http.StatusOK, task)

		})

		protected.PUT("/tasks/:id", func(c *gin.Context) {
			idStr := c.Param("id")
			var id uint
			if _, err := fmt.Sscanf(idStr, "%d", &id); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Group Task ID format"})
				return
			}
			var input model.Task
			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			task, err := dbRepo.GetTaskByID(id)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			if task == nil {
				c.JSON(http.StatusNotFound, gin.H{"message": "Task not found"})
				return
			}

			taskID, errUpdateTask := dbRepo.UpdateTask(task, input)
			if errUpdateTask != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{
				"status":  "success",
				"message": "successfully update group task",
				"id":      taskID,
			})
		})

		protected.DELETE("/tasks/:id", func(c *gin.Context) {
			idStr := c.Param("id")
			var id uint

			if _, err := fmt.Sscanf(idStr, "%d", &id); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Group Task ID format"})
				return
			}

			task, err := dbRepo.GetTaskByID(id)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			if task == nil {
				c.JSON(http.StatusNotFound, gin.H{"message": "Task not found"})
				return
			}

			errDeleteTask := dbRepo.DeleteTask(id)
			if errDeleteTask != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{
				"status":  "success",
				"message": "successfully delete task",
			})
		})
	}
	// Catch-all route for undefined routes
	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Page not found"})
	})

	return router
}

type Data struct {
	GroupTasks    []model.GroupTask    `json:"group_tasks"`
	Tasks         []model.Task         `json:"tasks"`
	Users         []model.User         `json:"users"`
	Organizations []model.Organization `json:"organizations"`
}

func main() {
	dbCredential := Credential{
		Host:         "localhost",
		Username:     "postgres",
		Password:     "pgsql26",
		DatabaseName: "project_management_tools",
		Port:         5432,
	}
	dbConn, err := Connect(&dbCredential)
	if err != nil {
		log.Fatal(err)
	}

	if err = dbConn.Migrator().DropTable(
		"organizations",
		"users",
		"tasks",
		"group_tasks",
		"user_tasks",
		"user_organizations",
	); err != nil {
		log.Fatal("failed dropping tables: " + err.Error())
	}

	if err = dbConn.AutoMigrate(
		&model.Organization{},
		&model.User{},
		&model.Task{},
		&model.GroupTask{},
		&model.UserOrganizations{},
		&model.UserTasks{},
	); err != nil {
		log.Fatal("failed migrating tables: " + err.Error())
	}

	InsertTestData(dbConn)
	authRepo := authRepository.NewRepository()
	dbRepo := dbRepository.NewRepository(dbConn)

	router := SetupRouter(dbRepo, authRepo)

	router.Run()

}

func InsertTestData(db *gorm.DB) {
	// Load the JSON file
	// server\backend\main.go
	sqlBytes, err := os.ReadFile("./testdatadb.sql") // Path to the uploaded db.json file
	if err != nil {
		log.Fatal(err)
	}

	// Menjalankan perintah SQL
	if err := db.Exec(string(sqlBytes)).Error; err != nil {
		log.Fatal(err)
	}
	// Insert data into the database
	fmt.Println("Data inserted successfully!")
}
