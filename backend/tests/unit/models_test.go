package unit_test

import (
	"testing"

	"github.com/stretchr/testify/suite"
	"gboard-backend/graph/model"
	"gboard-backend/internal/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// ModelTestSuite defines a test suite for the GORM models.
// Using a suite allows us to set up the database once for all tests in this file,
// which is much more efficient than setting it up and tearing it down for each test.
type ModelTestSuite struct {
	suite.Suite
	db *gorm.DB
}

// SetupSuite runs once before the tests in this suite are run.
// It sets up an in-memory SQLite database and migrates the schema.
func (s *ModelTestSuite) SetupSuite() {
	// Use a shared in-memory SQLite database to ensure data persists between test cases in the same suite.
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	s.Require().NoError(err, "Failed to open test database")
	s.db = db

	// Auto-migrate all necessary models.
	err = db.AutoMigrate(
		&models.User{},
		&models.Project{},
		&models.Board{},
		&models.Column{},
		&models.Issue{},
		&models.Comment{},
		&models.Attachment{},
		&models.Team{},
	)
	s.Require().NoError(err, "Failed to auto-migrate models")
}

// TearDownSuite runs once after all the tests in this suite have been run.
// It closes the database connection.
func (s *ModelTestSuite) TearDownSuite() {
	sqlDB, err := s.db.DB()
	s.Require().NoError(err)
	sqlDB.Close()
}

// In order for 'go test' to run this suite, we need to create
// a normal test function and pass our suite to suite.Run.
func TestModelSuite(t *testing.T) {
	suite.Run(t, new(ModelTestSuite))
}

// TestUserModel tests the creation and verification of a User model.
func (s *ModelTestSuite) TestUserModel() {
	// Test user creation with password hashing via GORM hook
	user := &models.User{
		Email:    "test@example.com",
		Name:     "Test User",
		Username: "testuser",
		Password: "testPassword123!",
	}

	err := s.db.Create(user).Error
	s.Require().NoError(err, "Failed to create user")

	// Verify user was created
	var createdUser models.User
	err = s.db.First(&createdUser, "email = ?", "test@example.com").Error
	s.Require().NoError(err, "Failed to find created user")

	s.Equal("test@example.com", createdUser.Email)
	s.Equal("Test User", createdUser.Name)
	s.Equal("testuser", createdUser.Username)
	s.NotEmpty(createdUser.ID)
	s.NotEmpty(createdUser.CreatedAt)

	// Verify password was hashed (it should not be the plain text password)
	s.NotEqual("testPassword123!", createdUser.Password)
	s.NotEmpty(createdUser.Password)

	// Test password verification
	err = models.VerifyPassword(createdUser.Password, "testPassword123!")
	s.Require().NoError(err, "Password verification should succeed for correct password")

	// Test wrong password
	err = models.VerifyPassword(createdUser.Password, "wrongPassword")
	s.Require().Error(err, "Password verification should fail for wrong password")
}

// TestProjectModel tests the creation and verification of a Project model.
func (s *ModelTestSuite) TestProjectModel() {
	// Create an owner user first
	owner := &models.User{
		Email:    "owner@example.com",
		Name:     "Project Owner",
		Username: "owner",
		Password: "ownerPassword123!",
	}
	err := s.db.Create(owner).Error
	s.Require().NoError(err, "Failed to create owner user for project test")

	// Test project creation
	project := &models.Project{
		Name:        "Test Project",
		Description: "Test project description",
		Key:         "TEST",
		OwnerID:     owner.ID,
	}

	err = s.db.Create(project).Error
	s.Require().NoError(err, "Failed to create project")

	// Verify project was created and relations are loaded
	var createdProject models.Project
	err = s.db.Preload("Owner").First(&createdProject, "key = ?", "TEST").Error
	s.Require().NoError(err, "Failed to find created project")

	s.Equal("Test Project", createdProject.Name)
	s.Equal("TEST", createdProject.Key)
	s.Equal(owner.ID, createdProject.OwnerID)
	s.NotEmpty(createdProject.ID)
	s.Require().NotNil(createdProject.Owner, "Owner should be preloaded")
	s.Equal(owner.ID, createdProject.Owner.ID)
}

// TestBoardModel tests the creation of a Board model.
func (s *ModelTestSuite) TestBoardModel() {
	// We can reuse the project created in the previous test, but for isolation, we create a new one.
	owner := &models.User{
		Email:    "boardowner@example.com",
		Name:     "Board Owner",
		Username: "boardowner",
		Password: "boardOwnerPassword!",
	}
	err := s.db.Create(owner).Error
	s.Require().NoError(err)

	project := &models.Project{
		Name:    "Project for Board",
		Key:     "PROJ2",
		OwnerID: owner.ID,
	}
	err = s.db.Create(project).Error
	s.Require().NoError(err)

	// Test board creation
	board := &models.Board{
		Name:      "Test Board",
		ProjectID: &project.ID,
	}
	err = s.db.Create(board).Error
	s.Require().NoError(err, "Failed to create board")

	// Verify board was created
	var createdBoard models.Board
	err = s.db.Preload("Project").First(&createdBoard, "name = ?", "Test Board").Error
	s.Require().NoError(err, "Failed to find created board")

	s.Equal("Test Board", createdBoard.Name)
	s.Equal(project.ID, *createdBoard.ProjectID)
	s.NotEmpty(createdBoard.ID)
	s.Require().NotNil(createdBoard.Project)
	s.Equal(project.ID, createdBoard.Project.ID)
}

// TestIssueModel tests the creation of a complete Issue with all relations.
func (s *ModelTestSuite) TestIssueModel() {
	// Create users
	reporter := &models.User{
		Email: "reporter@example.com", Name: "Issue Reporter", Username: "reporter", Password: "reporterPassword123!",
	}
	assignee := &models.User{
		Email: "assignee@example.com", Name: "Issue Assignee", Username: "assignee", Password: "assigneePassword123!",
	}
	err := s.db.Create(&[]*models.User{reporter, assignee}).Error
	s.Require().NoError(err, "Failed to create users for issue test")

	// Create project, board, and column
	project := &models.Project{Name: "Issue Project", Key: "ISSUEPROJ", OwnerID: reporter.ID}
	s.Require().NoError(s.db.Create(project).Error)
	board := &models.Board{Name: "Issue Board", ProjectID: &project.ID}
	s.Require().NoError(s.db.Create(board).Error)
	column := &models.Column{Name: "To Do", Position: 1, BoardID: board.ID}
	s.Require().NoError(s.db.Create(column).Error)

	// Test issue creation
	issue := &models.Issue{
		Title:       "Test Issue",
		Description: "Test issue description",
		Status:      string(model.IssueStatusTodo),
		Priority:    string(model.IssuePriorityMedium),
		IssueType:   string(model.IssueTypeTask),
		ReporterID:  reporter.ID,
		AssigneeID:  &assignee.ID,
		ColumnID:    column.ID,
		ProjectID:   project.ID,
		Key:         "ISSUE-1",
	}
	err = s.db.Create(issue).Error
	s.Require().NoError(err, "Failed to create issue")

	// Verify issue was created with all relations
	var createdIssue models.Issue
	err = s.db.Preload("Reporter").Preload("Assignee").Preload("Column").Preload("Project").First(&createdIssue, "title = ?", "Test Issue").Error
	s.Require().NoError(err, "Failed to find created issue")

	s.Equal("Test Issue", createdIssue.Title)
	s.Equal(reporter.ID, createdIssue.ReporterID)
	s.Equal(assignee.ID, *createdIssue.AssigneeID)
	s.Equal(column.ID, createdIssue.ColumnID)
	s.Equal(project.ID, createdIssue.ProjectID)
	s.NotEmpty(createdIssue.ID)
	s.Require().NotNil(createdIssue.Reporter)
	s.Require().NotNil(createdIssue.Assignee)
	s.Require().NotNil(createdIssue.Column)
	s.Require().NotNil(createdIssue.Project)
}

// TestTeamModel tests the creation of a Team and its relationships.
func (s *ModelTestSuite) TestTeamModel() {
	// Create a user for the team
	user := &models.User{
		Email:    "teammember@example.com",
		Name:     "Team Member",
		Username: "teammember",
		Password: "password123",
	}
	s.Require().NoError(s.db.Create(user).Error)

	// Create a team
	team := &models.Team{
		Name:        "Engineering Team",
		Description: "The best team",
	}
	s.Require().NoError(s.db.Create(team).Error)

	// Add member to team (using GORM association)
	err := s.db.Model(team).Association("Members").Append(user)
	s.Require().NoError(err, "Failed to add user to team")

	// Create a default board for the team
	board := &models.Board{
		Name:   "Engineering Board",
		TeamID: &team.ID,
	}
	// Note: Board.ProjectID is now optional, so this should work
	s.Require().NoError(s.db.Create(board).Error)

	// Link board to team as default board
	team.DefaultBoardID = &board.ID
	s.Require().NoError(s.db.Save(team).Error)

	// Verify team structure and relationships
	var createdTeam models.Team
	err = s.db.Preload("Members").Preload("DefaultBoard").First(&createdTeam, "id = ?", team.ID).Error
	s.Require().NoError(err, "Failed to find created team")

	s.Equal("Engineering Team", createdTeam.Name)
	s.Equal("The best team", createdTeam.Description)
	s.NotEmpty(createdTeam.ID)
	
	// Verify members
	s.Require().Len(createdTeam.Members, 1)
	s.Equal(user.ID, createdTeam.Members[0].ID)

	// Verify default board
	s.Require().NotNil(createdTeam.DefaultBoard)
	s.Equal(board.ID, createdTeam.DefaultBoard.ID)
	s.Equal("Engineering Board", createdTeam.DefaultBoard.Name)
}