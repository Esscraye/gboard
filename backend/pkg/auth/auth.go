package auth

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"gboard-backend/internal/models"
)

var (
	ErrInvalidToken = errors.New("invalid token")
	ErrExpiredToken = errors.New("expired token")
)

type Claims struct {
	UserID string `json:"userId"`
	jwt.RegisteredClaims
}

func GenerateToken(user *models.User) (string, string, error) {
	// Get JWT secret from environment or use default
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "gboard-secret-key-change-in-production"
	}

	// Get token expiration from environment or use default (24 hours)
	tokenExpiration := 24 * time.Hour
	if exp := os.Getenv("JWT_EXPIRATION"); exp != "" {
		var err error
		tokenExpiration, err = time.ParseDuration(exp)
		if err != nil {
			tokenExpiration = 24 * time.Hour
		}
	}

	// Get refresh token expiration from environment or use default (7 days)
	refreshExpiration := 7 * 24 * time.Hour
	if exp := os.Getenv("JWT_REFRESH_EXPIRATION"); exp != "" {
		var err error
		refreshExpiration, err = time.ParseDuration(exp)
		if err != nil {
			refreshExpiration = 7 * 24 * time.Hour
		}
	}

	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, Claims{
		UserID: user.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(tokenExpiration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	})

	// Sign token
	signedToken, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", "", err
	}

	// Create refresh token
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, Claims{
		UserID: user.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(refreshExpiration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	})

	// Sign refresh token
	signedRefreshToken, err := refreshToken.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", "", err
	}

	return signedToken, signedRefreshToken, nil
}

func ValidateToken(tokenString string) (*Claims, error) {
	// Get JWT secret from environment or use default
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "gboard-secret-key-change-in-production"
	}

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, ErrExpiredToken
		}
		return nil, ErrInvalidToken
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, ErrInvalidToken
}

func RefreshToken(refreshTokenString string) (string, string, error) {
	// Validate refresh token
	claims, err := ValidateToken(refreshTokenString)
	if err != nil {
		return "", "", err
	}

	// Generate new tokens
	user := &models.User{
		BaseModel: models.BaseModel{ID: claims.UserID},
	}

	return GenerateToken(user)
}