package graph

import (
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"gorm.io/gorm"
)

type GraphQLHandler struct {
	handler *handler.Server
}

func NewGraphQLHandler(db *gorm.DB) *GraphQLHandler {
	// Initialize your GraphQL schema and resolvers here
	// This is a placeholder - we'll implement the actual schema next
	h := handler.NewDefaultServer(nil)
	return &GraphQLHandler{handler: h}
}

func (g *GraphQLHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	g.handler.ServeHTTP(w, r)
}