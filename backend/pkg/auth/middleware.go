package auth

import (
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gboard-backend/internal/models"
)

// userCtxKey is a private type to be used as a context key. This prevents
// collisions with other context keys.
type userCtxKey string

const userKey = userCtxKey("user")

// GinMiddleware creates a gin.HandlerFunc for JWT authentication.
// It checks for a token in the Authorization header, validates it, and if valid,
// injects a user object into the request's context. It does not block requests,
// allowing authorization to be handled by the resolvers.
func GinMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.Request.Header.Get("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.Next()
			return
		}
		tokenString := parts[1]

		claims, err := ValidateToken(tokenString)
		if err != nil {
			c.Next() // Invalid token, proceed without user
			return
		}

		user := &models.User{
			BaseModel: models.BaseModel{ID: claims.UserID},
		}

		// Add user to the request's context
		ctx := context.WithValue(c.Request.Context(), userKey, user)
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

// ForContext finds the user from the context. It's used by resolvers

// to get the authenticated user.

func ForContext(ctx context.Context) *models.User {

	raw, _ := ctx.Value(userKey).(*models.User)

	return raw

}



// AuthMiddleware is a deprecated net/http middleware. Use GinMiddleware instead.

func AuthMiddleware(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {

			next.ServeHTTP(w, r)

			return

		}



		tokenParts := strings.Split(authHeader, " ")

		if len(tokenParts) != 2 || strings.ToLower(tokenParts[0]) != "bearer" {

			next.ServeHTTP(w, r)

			return

		}

		tokenString := tokenParts[1]



		claims, err := ValidateToken(tokenString)

		if err != nil {

			http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)

			return

		}



		user := &models.User{

			BaseModel: models.BaseModel{ID: claims.UserID},

		}



		ctx := context.WithValue(r.Context(), userKey, user)

		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)

	})

}
