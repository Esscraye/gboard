import { gql } from "@apollo/client"

// Auth Mutations
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        username
        email
      }
    }
  }
`

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      user {
        id
        name
        username
        email
      }
    }
  }
`

// Project Mutations
export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      key
      description
      owner {
        id
        name
        username
      }
      boards {
        id
        name
      }
      createdAt
    }
  }
`

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      name
      description
      updatedAt
    }
  }
`

export const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`

// Column Mutations
export const CREATE_COLUMN_MUTATION = gql`
  mutation CreateColumn($input: CreateColumnInput!) {
    createColumn(input: $input) {
      id
      name
      position
    }
  }
`

export const UPDATE_COLUMN_MUTATION = gql`
  mutation UpdateColumn($id: ID!, $input: UpdateColumnInput!) {
    updateColumn(id: $id, input: $input) {
      id
      name
      position
    }
  }
`

export const DELETE_COLUMN_MUTATION = gql`
  mutation DeleteColumn($id: ID!) {
    deleteColumn(id: $id)
  }
`

// Issue Mutations
export const CREATE_ISSUE_MUTATION = gql`
  mutation CreateIssue($input: CreateIssueInput!) {
    createIssue(input: $input) {
      id
      title
      description
      key
      priority
      issueType
      status
      reporter {
        id
        name
        username
      }
      assignee {
        id
        name
        username
      }
      column {
        id
        name
      }
      createdAt
    }
  }
`

export const UPDATE_ISSUE_MUTATION = gql`
  mutation UpdateIssue($id: ID!, $input: UpdateIssueInput!) {
    updateIssue(id: $id, input: $input) {
      id
      title
      description
      priority
      issueType
      status
      assignee {
        id
        name
        username
      }
      column {
        id
        name
      }
      updatedAt
    }
  }
`

export const MOVE_ISSUE_MUTATION = gql`
  mutation MoveIssue($id: ID!, $columnId: ID!) {
    moveIssue(id: $id, columnId: $columnId) {
      id
      title
      column {
        id
        name
      }
    }
  }
`

export const DELETE_ISSUE_MUTATION = gql`
  mutation DeleteIssue($id: ID!) {
    deleteIssue(id: $id)
  }
`

// Comment Mutations
export const CREATE_COMMENT_MUTATION = gql`
  mutation AddComment($input: AddCommentInput!) {
    addComment(input: $input) {
      id
      content
      author {
        id
        name
        username
      }
      createdAt
    }
  }
`

export const UPDATE_COMMENT_MUTATION = gql`
  mutation UpdateComment($id: ID!, $content: String!) {
    updateComment(id: $id, content: $content) {
      id
      content
      updatedAt
    }
  }
`

export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`

// User Mutations
export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      username
      email
      updatedAt
    }
  }
`

// Board Mutations
export const CREATE_BOARD_MUTATION = gql`
  mutation CreateBoard($input: CreateBoardInput!) {
    createBoard(input: $input) {
      id
      name
      project {
        id
        name
        key
      }
      team {
        id
        name
      }
      createdAt
    }
  }
`

export const UPDATE_BOARD_MUTATION = gql`
  mutation UpdateBoard($id: ID!, $input: UpdateBoardInput!) {
    updateBoard(id: $id, input: $input) {
      id
      name
      updatedAt
    }
  }
`

export const DELETE_BOARD_MUTATION = gql`
  mutation DeleteBoard($id: ID!) {
    deleteBoard(id: $id)
  }
`

// Team Mutations
export const CREATE_TEAM_MUTATION = gql`
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      id
      name
      description
      defaultBoard {
        id
        name
      }
      createdAt
    }
  }
`

export const ADD_USER_TO_TEAM_MUTATION = gql`
  mutation AddUserToTeam($teamId: ID!, $userId: ID!) {
    addUserToTeam(teamId: $teamId, userId: $userId) {
      id
      name
      members {
        id
        name
        username
      }
    }
  }
`

// Column Move Mutation
export const MOVE_COLUMN_MUTATION = gql`
  mutation MoveColumn($id: ID!, $newPosition: Int!) {
    moveColumn(id: $id, newPosition: $newPosition) {
      id
      name
      position
    }
  }
`
