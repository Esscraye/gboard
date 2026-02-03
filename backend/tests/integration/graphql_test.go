package integration_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/suite"
	"gboard-backend/config"
	"gboard-backend/graph"
	"gboard-backend/internal/models"
	"gboard-backend/pkg/auth"
)

// GraphQLTestSuite defines a test suite for the GraphQL endpoint.
// It sets up a test server and a pre-authenticated user once, making
// tests faster and cleaner as they don't need to repeat setup and auth.
type GraphQLTestSuite struct {
	suite.Suite
	server *httptest.Server
	token  string // Auth token for the test user
	user   *models.User
}

// gqlRequest represents the body of a GraphQL request.
type gqlRequest struct {
	Query     string                 `json:"query"`
	Variables map[string]interface{} `json:"variables"`
}

// gqlResponse represents a generic GraphQL response, used for unmarshaling.
// The 'Data' field is left as json.RawMessage to be decoded into specific structs later.
type gqlResponse struct {
	Data   json.RawMessage        `json:"data"`
	Errors []map[string]interface{} `json:"errors,omitempty"`
}

// SetupSuite runs once before the tests in this suite are run.
func (s *GraphQLTestSuite) SetupSuite() {
	// Initialize a test database (in-memory SQLite)
	repo, err := config.InitTestDatabase()
	s.Require().NoError(err, "Failed to initialize test database")

	// Set up the Gin router and GraphQL server
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(auth.GinMiddleware()) // Apply the new auth middleware

	resolver := &graph.Resolver{Repository: repo}
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))

	router.POST("/query", func(c *gin.Context) {
		srv.ServeHTTP(c.Writer, c.Request)
	})

	s.server = httptest.NewServer(router)

	// === Create a user and get a token for all subsequent tests ===
	signupInput := map[string]interface{}{
		"email":    "test-user@example.com",
		"name":     "Test User",
		"username": "testuser",
		"password": "password123",
	}

	var signupResp struct {
		Signup struct {
			Token string       `json:"token"`
			User  *models.User `json:"user"`
		} `json:"signup"`
	}

	s.makeGraphQLRequest(
		`mutation Signup($input: SignupInput!) { signup(input: $input) { token, user { id, email, name, username } } }`,
		map[string]interface{}{"input": signupInput},
		"", // No token needed for signup
		&signupResp,
	)

	s.Require().NotEmpty(signupResp.Signup.Token, "Signup should return a token")
	s.Require().NotNil(signupResp.Signup.User, "Signup should return a user")
	s.token = signupResp.Signup.Token
	s.user = signupResp.Signup.User
}

// TearDownSuite runs once after all the tests in this suite have been run.
func (s *GraphQLTestSuite) TearDownSuite() {
	s.server.Close()
}

// makeGraphQLRequest is a helper function to execute a GraphQL query/mutation against the test server.
// It takes the query, variables, an auth token, and a pointer to a struct for the response data.
func (s *GraphQLTestSuite) makeGraphQLRequest(query string, variables map[string]interface{}, token string, responseData interface{}) {
	requestBody := gqlRequest{
		Query:     query,
		Variables: variables,
	}
	jsonBody, err := json.Marshal(requestBody)
	s.Require().NoError(err, "Failed to marshal request body")

	req, err := http.NewRequest("POST", s.server.URL+"/query", bytes.NewBuffer(jsonBody))
	s.Require().NoError(err, "Failed to create HTTP request")

	req.Header.Set("Content-Type", "application/json")
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	s.Require().NoError(err, "Failed to make HTTP request")
	defer resp.Body.Close()

	var gqlResp gqlResponse
	err = json.NewDecoder(resp.Body).Decode(&gqlResp)
	s.Require().NoError(err, "Failed to decode response body")

	s.Require().Empty(gqlResp.Errors, "GraphQL request should not have errors")

	// Unmarshal the raw Data field into the specific struct provided
	err = json.Unmarshal(gqlResp.Data, responseData)
	s.Require().NoError(err, "Failed to unmarshal GraphQL data into target struct")
}

// TestGraphQLSuite runs the entire GraphQL test suite.
func TestGraphQLSuite(t *testing.T) {
	suite.Run(t, new(GraphQLTestSuite))
}

// TestLogin tests the login mutation for the pre-authenticated user.
func (s *GraphQLTestSuite) TestLogin() {
	var loginResp struct {
		Login struct {
			Token string `json:"token"`
		} `json:"login"`
	}

	s.makeGraphQLRequest(
		`mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { token } }`,
		map[string]interface{}{"email": "test-user@example.com", "password": "password123"},
		"",
		&loginResp,
	)

	s.NotEmpty(loginResp.Login.Token, "Login should return a new token")
}

// TestCreateProject tests the createProject mutation.
func (s *GraphQLTestSuite) TestCreateProject() {
	var createProjectResp struct {
		CreateProject models.Project `json:"createProject"`
	}

	s.makeGraphQLRequest(
		`mutation CreateProject($input: CreateProjectInput!) { createProject(input: $input) { id, name, key, owner { id } } }`,
		map[string]interface{}{
			"input": map[string]interface{}{
				"name": "My New Project",
				"key":  "MNP",
			},
		},
		s.token, // Use the token from the suite setup
		&createProjectResp,
	)

	project := createProjectResp.CreateProject
	s.NotEmpty(project.ID, "Created project should have an ID")
	s.Equal("My New Project", project.Name)
	s.Equal("MNP", project.Key)
	s.Equal(s.user.ID, project.Owner.ID, "Project owner should be the authenticated user")
}

// TestCreateBoard tests the createBoard mutation.
func (s *GraphQLTestSuite) TestCreateBoard() {
	// 1. Create a project to which the board will be added.
	var createProjectResp struct {
		CreateProject models.Project `json:"createProject"`
	}
	s.makeGraphQLRequest(
		`mutation CreateProject($input: CreateProjectInput!) { createProject(input: $input) { id } }`,
		map[string]interface{}{"input": map[string]interface{}{"name": "Board Project", "key": "BP"}},
		s.token,
		&createProjectResp,
	)
	projectID := createProjectResp.CreateProject.ID
	s.Require().NotEmpty(projectID)

	// 2. Create the board within that project.
	var createBoardResp struct {
		CreateBoard models.Board `json:"createBoard"`
	}
	s.makeGraphQLRequest(
		`mutation CreateBoard($input: CreateBoardInput!) { createBoard(input: $input) { id, name, project { id } } }`,
		map[string]interface{}{
			"input": map[string]interface{}{
				"name":      "My New Board",
				"projectId": projectID,
			},
		},
		s.token,
		&createBoardResp,
	)

	board := createBoardResp.CreateBoard
	s.NotEmpty(board.ID, "Created board should have an ID")
	s.Equal("My New Board", board.Name)
	s.Equal(projectID, board.Project.ID, "Board should be linked to the correct project")
}