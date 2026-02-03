# GBoard Backend Project

This document provides a summary of the GBoard backend project, its structure, and conventions to guide future development and interactions.

## Project Overview

GBoard is a Go-based backend server for a Jira-like project management application. It exposes a GraphQL API for managing projects, boards, issues, and users.

- **Language:** Go
- **API:** GraphQL
- **Frameworks/Libraries:**
  - `gin-gonic/gin`: HTTP web framework.
  - `gqlgen`: GraphQL library for Go.
  - `gorm`: ORM for database interactions.
  - `jwt-go`: For handling JWT-based authentication.

The GraphQL schema is defined in `graph/schema.graphqls` and includes types for `Project`, `Board`, `Column`, `Issue`, `User`, and related entities.

## Building and Running

The application can be run directly using the Go toolchain.

**To run the server:**

```bash
go run cmd/main.go
```

The server will start on port `8080` by default. The GraphQL playground is available at `http://localhost:8080/`.

## Testing

The project contains unit and integration tests. A helper script is provided to run a subset of the tests.

**To run the main tests:**

```bash
./run_tests.sh
```

**To run all tests:**

```bash
go test ./... -v
```

Note that some tests might require a specific database setup or further adjustments to run correctly.

## Database

The application uses `gorm` as its ORM and supports both PostgreSQL and SQLite. The database connection is initialized in `pkg/database/database.go`.

The database schema is automatically migrated when the application starts, as configured in `cmd/main.go`.

## Authentication

Authentication is handled via JWT (JSON Web Tokens). The `/query` endpoint is protected by the `auth.AuthMiddleware`. The GraphQL schema defines mutations for user `signup`, `login`, and `refreshToken`. The authentication logic can be found in the `pkg/auth/` directory.

## Development Conventions

- **GraphQL Schema:** All GraphQL schema changes should be made in `graph/schema.graphqls`. After modifying the schema, the corresponding Go models and resolvers should be regenerated using `gqlgen`.
- **Code Generation:** The project uses `gqlgen` to generate Go code from the GraphQL schema. This includes models in `graph/model/models_gen.go` and the base server in `graph/generated.go`.
- **Dependencies:** Project dependencies are managed using Go Modules (`go.mod` and `go.sum`).
- **Hot-Reloading**: For this project, hot-reloading is always enabled for all services. Manual builds are never necessary and should not be attempted.
