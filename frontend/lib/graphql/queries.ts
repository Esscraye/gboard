import { gql } from "@apollo/client"

// User Queries
export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      username
      email
      createdAt
      updatedAt
    }
  }
`

export const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      username
      email
      createdAt
      updatedAt
    }
  }
`

export const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      id
      name
      username
      email
    }
  }
`

// Project Queries
export const GET_PROJECTS_QUERY = gql`
  query GetProjects {
    projects {
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
      updatedAt
    }
  }
`

export const GET_PROJECT_QUERY = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      key
      description
      owner {
        id
        name
        username
      }
      members {
        id
        name
        username
        email
      }
      boards {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`

// Board Queries
export const GET_BOARD_QUERY = gql`
  query GetBoards($projectId: ID!) {
    boards(projectId: $projectId) {
      id
      name
      project {
        id
        name
        key
      }
      columns {
        id
        name
        position
        issues {
          id
          title
          key
          description
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
          createdAt
        }
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_BOARD_BY_ID_QUERY = gql`
  query GetBoard($id: ID!) {
    board(id: $id) {
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
      columns {
        id
        name
        position
        issues {
          id
          title
          key
          description
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
          createdAt
        }
      }
      createdAt
      updatedAt
    }
  }
`

// Team Queries
export const GET_TEAMS_QUERY = gql`
  query GetTeams {
    teams {
      id
      name
      description
      members {
        id
        name
        username
        avatarUrl
      }
      defaultBoard {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_TEAM_QUERY = gql`
  query GetTeam($id: ID!) {
    team(id: $id) {
      id
      name
      description
      members {
        id
        name
        username
        email
        avatarUrl
      }
      projects {
        id
        name
        key
      }
      defaultBoard {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`

// Issue Queries
export const GET_ISSUE_QUERY = gql`
  query GetIssue($id: ID!) {
    issue(id: $id) {
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
      comments {
        id
        content
        author {
          id
          name
          username
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`
