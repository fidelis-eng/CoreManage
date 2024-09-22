package service

import (
	model "a21hc3NpZ25tZW50/model"
	"a21hc3NpZ25tZW50/repository/authRepository"
	dbRepository "a21hc3NpZ25tZW50/repository/dbRepository"
	"errors"
	"reflect"

	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	repository     dbRepository.Repository
	authRepository *authRepository.Repository
	UserLogin      model.User
}

func NewService(repo dbRepository.Repository, auth *authRepository.Repository) *Service {
	return &Service{repository: repo, UserLogin: model.User{}, authRepository: auth}
}

func VerifyPassword(inputPassword string, storedHash string) error {
	err := bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(inputPassword))
	if err != nil {
		return err
	}
	return nil
}
func EncryptPassword(inputPassword string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(inputPassword), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func IsEmptyUser(user model.User) bool {
	return reflect.DeepEqual(user, model.User{})
}

func (s *Service) Register(user model.User) error {
	if !IsEmptyUser(s.UserLogin) {
		return errors.New("user already login")
	}

	userDB, _ := s.repository.GetUserByUsername(string(user.Username))
	if userDB.Username != "" && userDB.Username == user.Username {
		return errors.New("username already registered")
	}
	hashedPass, err := EncryptPassword(user.Password)
	if err != nil {
		return err
	}
	user.Password = hashedPass
	userId, errAddUser := s.repository.AddUser(user)
	if errAddUser != nil {
		return err
	}
	user.ID = userId
	if err := s.repository.AddOrganizationByUser(user); err != nil {
		return err
	}

	return nil
}

func (s *Service) Login(username string, password string) (string, error) {
	if s.authRepository.IsLoggedIn() {
		return "", errors.New("user already login")
	}

	user, err := s.repository.GetUserByUsername(username)
	if err != nil {
		return "", errors.New("username or password is wrong")
	}

	if err := VerifyPassword(password, user.Password); err != nil {
		return "", errors.New("username or password is wrong")
	}
	tokenString, err := s.authRepository.GenerateJWT(username, user.ID)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
