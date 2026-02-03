# GBoard CLI

GBoard CLI is a command-line interface for managing your Kanban projects directly from your terminal.

## Installation

```bash
# Clone the repository
git clone https://github.com/tonsorg/gboard.git
cd gboard/backend/cli

# Build the CLI
go build -o gboard

# Install (optional)
sudo mv gboard /usr/local/bin/
```

## Configuration

1. Copy the example configuration:
```bash
cp .env.example .env
```

2. Edit the `.env` file with your API credentials:
```env
GBOARD_API_URL=https://api.gboard.com/graphql
GBOARD_API_TOKEN=your_jwt_token_here
```

3. (Optional) Edit `config.yml` for additional settings.

## Usage

### Projects

```bash
# Create a new project
gboard project create --name "My Project" --description "Project description"

# List all projects
gboard project list

# Show project details
gboard project show <project-id>

# Update a project
gboard project update <project-id> --name "New Name"

# Delete a project
gboard project delete <project-id>
```

### Configuration

```bash
# Show current configuration
gboard config show

# Set a configuration value
gboard config set api.url "https://new-api-url.com"
```

## Development

### Running Tests

```bash
# Run unit tests
go test ./tests/unit/...

# Run integration tests
go test ./tests/integration/...
```

### Building

```bash
# Build for current platform
go build -o gboard

# Cross-compile for other platforms
env GOOS=linux GOARCH=amd64 go build -o gboard-linux
env GOOS=windows GOARCH=amd64 go build -o gboard.exe
env GOOS=darwin GOARCH=amd64 go build -o gboard-mac
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
