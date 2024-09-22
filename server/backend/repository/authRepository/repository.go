package authRepository

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type LoggedInUser struct {
	Username string
}

type Repository struct {
	LoggedInUser *LoggedInUser
}

func NewRepository() *Repository {
	return &Repository{}
}

var jwtKey = []byte("secret-key")

type Claims struct {
	Username string `json:"username"`
	UserId   uint   `json:"user_id"`
	jwt.RegisteredClaims
}

func (r *Repository) Login(username string) error {
	r.LoggedInUser = &LoggedInUser{
		Username: username,
	}

	return nil
}

func (r *Repository) GenerateJWT(username string, userId uint) (string, error) {
	expirationTime := time.Now().Add(5 * time.Minute)

	claims := &Claims{
		Username: username,
		UserId:   userId,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (r *Repository) ValidJWT(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		return &Claims{}, err
	}

	if !token.Valid {
		return &Claims{}, nil
	}
	// check role
	return claims, nil
}

func (r *Repository) Logout() {
	r.LoggedInUser = nil
}

func (r *Repository) IsLoggedIn() bool {
	return r.LoggedInUser != nil
}
