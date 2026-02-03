export type User = {
  id: string
  name: string
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

export type Team = {
  id: string
  name: string
  description?: string
  members?: User[]
  projects?: Project[]
  defaultBoard?: Board
  createdAt: string
  updatedAt: string
}

export type Project = {
  id: string
  name: string
  key: string
  description?: string
  leadId: string
  lead?: User
  owner?: User
  board?: Board
  boards?: Board[]
  members?: User[]
  teams?: Team[]
  createdAt: string
  updatedAt: string
}

export type Board = {
  id: string
  name: string
  projectId?: string
  project?: Project
  teamId?: string
  team?: Team
  columns?: Column[]
  createdAt: string
  updatedAt: string
}

export type Column = {
  id: string
  name: string
  position: number
  boardId: string
  issues?: Issue[]
  createdAt: string
  updatedAt: string
}

export type Issue = {
  id: string
  title: string
  description?: string
  key: string
  priority: Priority
  type: IssueType
  status: IssueStatus
  reporterId: string
  reporter?: User
  assigneeId?: string
  assignee?: User
  columnId: string
  position: number
  comments?: Comment[]
  createdAt: string
  updatedAt: string
}

export type Comment = {
  id: string
  content: string
  authorId: string
  author?: User
  issueId: string
  createdAt: string
  updatedAt: string
}

export enum Priority {
  LOWEST = "LOWEST",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  HIGHEST = "HIGHEST",
}

export enum IssueType {
  BUG = "BUG",
  TASK = "TASK",
  STORY = "STORY",
  EPIC = "EPIC",
}

export enum IssueStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

// Input types for mutations
export type CreateProjectInput = {
  name: string
  key: string
  description?: string
}

export type UpdateProjectInput = {
  name?: string
  description?: string
}

export type CreateColumnInput = {
  name: string
  boardId: string
  position?: number
}

export type UpdateColumnInput = {
  name?: string
  position?: number
}

export type CreateIssueInput = {
  title: string
  description?: string
  priority?: Priority
  type: IssueType
  columnId: string
  assigneeId?: string
}

export type UpdateIssueInput = {
  title?: string
  description?: string
  priority?: Priority
  type?: IssueType
  status?: IssueStatus
  assigneeId?: string
  columnId?: string
  position?: number
}

export type MoveIssueInput = {
  columnId: string
  position: number
}

export type CreateCommentInput = {
  content: string
  issueId: string
}

export type UpdateCommentInput = {
  content: string
}

// Auth types
export type AuthPayload = {
  token: string
  user: User
}

export type LoginInput = {
  email: string
  password: string
}

export type SignupInput = {
  name: string
  username: string
  email: string
  password: string
}
