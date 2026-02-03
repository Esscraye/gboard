package repositories

import (
	"gboard-backend/internal/models"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

// Project Repository Methods
func (r *Repository) CreateProject(project *models.Project) error {
	return r.db.Create(project).Error
}

func (r *Repository) GetProjectByID(id string) (*models.Project, error) {
	var project models.Project
	err := r.db.Preload("Owner").Preload("Members").Preload("Boards").First(&project, "id = ?", id).Error
	return &project, err
}

func (r *Repository) GetAllProjects() ([]*models.Project, error) {
	var projects []*models.Project
	err := r.db.Preload("Owner").Preload("Members").Preload("Boards").Find(&projects).Error
	return projects, err
}

func (r *Repository) UpdateProject(project *models.Project) error {
	return r.db.Save(project).Error
}

func (r *Repository) DeleteProject(id string) error {
	return r.db.Delete(&models.Project{}, "id = ?", id).Error
}

// Board Repository Methods
func (r *Repository) CreateBoard(board *models.Board) error {
	return r.db.Create(board).Error
}

func (r *Repository) GetBoardByID(id string) (*models.Board, error) {
	var board models.Board
	err := r.db.Preload("Project").Preload("Columns").First(&board, "id = ?", id).Error
	return &board, err
}

func (r *Repository) GetBoardsByProjectID(projectID string) ([]*models.Board, error) {
	var boards []*models.Board
	err := r.db.Preload("Project").
		Preload("Columns").
		Preload("Columns.Issues").
		Preload("Columns.Issues.Reporter").
		Preload("Columns.Issues.Assignee").
		Where("project_id = ?", projectID).
		Find(&boards).Error
	return boards, err
}

func (r *Repository) UpdateBoard(board *models.Board) error {
	return r.db.Save(board).Error
}

func (r *Repository) DeleteBoard(id string) error {
	return r.db.Delete(&models.Board{}, "id = ?", id).Error
}

// Column Repository Methods
func (r *Repository) CreateColumn(column *models.Column) error {
	return r.db.Create(column).Error
}

func (r *Repository) GetColumnByID(id string) (*models.Column, error) {
	var column models.Column
	err := r.db.Preload("Board").Preload("Issues").First(&column, "id = ?", id).Error
	return &column, err
}

func (r *Repository) UpdateColumn(column *models.Column) error {
	return r.db.Save(column).Error
}

func (r *Repository) DeleteColumn(id string) error {
	return r.db.Delete(&models.Column{}, "id = ?", id).Error
}

func (r *Repository) MoveColumn(id string, newPosition int) (*models.Column, error) {
	var column models.Column
	err := r.db.First(&column, "id = ?", id).Error
	if err != nil {
		return nil, err
	}

	column.Position = newPosition
	err = r.db.Save(&column).Error
	return &column, err
}

// Issue Repository Methods
func (r *Repository) CreateIssue(issue *models.Issue) error {
	return r.db.Create(issue).Error
}

func (r *Repository) GetIssueByID(id string) (*models.Issue, error) {
	var issue models.Issue
	err := r.db.Preload("Reporter").Preload("Assignee").Preload("Column").Preload("Project").
		Preload("Comments").Preload("Comments.Author").Preload("Attachments").
		First(&issue, "id = ?", id).Error
	return &issue, err
}

func (r *Repository) GetIssuesByProjectID(projectID string) ([]*models.Issue, error) {
	var issues []*models.Issue
	err := r.db.Preload("Reporter").Preload("Assignee").Preload("Column").Preload("Project").
		Where("project_id = ?", projectID).Find(&issues).Error
	return issues, err
}

func (r *Repository) GetIssuesByBoardID(boardID string) ([]*models.Issue, error) {
	var issues []*models.Issue
	err := r.db.Preload("Reporter").Preload("Assignee").Preload("Column").Preload("Project").
		Joins("JOIN columns ON issues.column_id = columns.id").
		Where("columns.board_id = ?", boardID).Find(&issues).Error
	return issues, err
}

func (r *Repository) UpdateIssue(issue *models.Issue) error {
	return r.db.Save(issue).Error
}

func (r *Repository) DeleteIssue(id string) error {
	return r.db.Delete(&models.Issue{}, "id = ?", id).Error
}

func (r *Repository) MoveIssue(id string, columnID string) (*models.Issue, error) {
	var issue models.Issue
	err := r.db.First(&issue, "id = ?", id).Error
	if err != nil {
		return nil, err
	}

	issue.ColumnID = columnID
	err = r.db.Save(&issue).Error
	return &issue, err
}

// Comment Repository Methods
func (r *Repository) CreateComment(comment *models.Comment) error {
	return r.db.Create(comment).Error
}

func (r *Repository) GetCommentByID(id string) (*models.Comment, error) {
	var comment models.Comment
	err := r.db.Preload("Author").Preload("Issue").First(&comment, "id = ?", id).Error
	return &comment, err
}

func (r *Repository) UpdateComment(comment *models.Comment) error {
	return r.db.Save(comment).Error
}

func (r *Repository) DeleteComment(id string) error {
	return r.db.Delete(&models.Comment{}, "id = ?", id).Error
}

// User Repository Methods
func (r *Repository) CreateUser(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *Repository) GetUserByID(id string) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, "id = ?", id).Error
	return &user, err
}

func (r *Repository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *Repository) GetAllUsers() ([]*models.User, error) {
	var users []*models.User
	err := r.db.Find(&users).Error
	return users, err
}

func (r *Repository) UpdateUser(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *Repository) DeleteUser(id string) error {
	return r.db.Delete(&models.User{}, "id = ?", id).Error
}

// Team Repository Methods
func (r *Repository) CreateTeam(team *models.Team) error {
	return r.db.Create(team).Error
}

func (r *Repository) GetTeamByID(id string) (*models.Team, error) {
	var team models.Team
	err := r.db.Preload("Members").Preload("Projects").Preload("DefaultBoard").First(&team, "id = ?", id).Error
	return &team, err
}

func (r *Repository) GetAllTeams() ([]*models.Team, error) {
	var teams []*models.Team
	err := r.db.Preload("Members").Preload("Projects").Find(&teams).Error
	return teams, err
}

func (r *Repository) UpdateTeam(team *models.Team) error {
	return r.db.Save(team).Error
}

func (r *Repository) DeleteTeam(id string) error {
	return r.db.Delete(&models.Team{}, "id = ?", id).Error
}

func (r *Repository) AddUserToTeam(teamID string, userID string) error {
	var team models.Team
	if err := r.db.First(&team, "id = ?", teamID).Error; err != nil {
		return err
	}
	var user models.User
	if err := r.db.First(&user, "id = ?", userID).Error; err != nil {
		return err
	}
	return r.db.Model(&team).Association("Members").Append(&user)
}

func (r *Repository) RemoveUserFromTeam(teamID string, userID string) error {
	var team models.Team
	if err := r.db.First(&team, "id = ?", teamID).Error; err != nil {
		return err
	}
	var user models.User
	if err := r.db.First(&user, "id = ?", userID).Error; err != nil {
		return err
	}
	return r.db.Model(&team).Association("Members").Delete(&user)
}

func (r *Repository) AddTeamToProject(projectID string, teamID string) error {
	var project models.Project
	if err := r.db.First(&project, "id = ?", projectID).Error; err != nil {
		return err
	}
	var team models.Team
	if err := r.db.First(&team, "id = ?", teamID).Error; err != nil {
		return err
	}
	return r.db.Model(&project).Association("Teams").Append(&team)
}

// Auto-migrate all models
func (r *Repository) AutoMigrate() error {
	// Explicitly create teams table first if it doesn't exist to avoid FK issues in circular dependencies
	if !r.db.Migrator().HasTable(&models.Team{}) {
		if err := r.db.Migrator().CreateTable(&models.Team{}); err != nil {
			return err
		}
	}

	return r.db.AutoMigrate(
		&models.User{},
		&models.Team{},
		&models.Project{},
		&models.Board{},
		&models.Column{},
		&models.Issue{},
		&models.Comment{},
		&models.Attachment{},
	)
}