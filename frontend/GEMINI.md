# Gemini Project Context: gboard

This document provides context for the gboard frontend project, a modern project management application.

## Project Overview

Gboard is a web application for project management, featuring Kanban boards to organize tasks and workflows. It's built with a modern technology stack, centered around Next.js and GraphQL. The user interface is designed to be responsive and intuitive, with features like drag-and-drop for task management.

### Key Technologies

*   **Framework**: [Next.js](https://nextjs.org/) (using the App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **UI Library**: [React](https://reactjs.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Data Fetching**: [Apollo Client](https://www.apollographql.com/docs/react/) for GraphQL
*   **Drag and Drop**: [@dnd-kit](https://dndkit.com/)

## Building and Running the Project

The project uses `bun` as the package manager.

### Key Commands

*   **Install dependencies**:
    ```bash
    bun install
    ```
*   **Run the development server**:
    ```bash
    bun run dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

*   **Build for production**:
    ```bash
    bun run build
    ```

*   **Run in production mode**:
    ```bash
    bun run start
    ```

*   **Lint the code**:
    ```bash
    bun run lint
    ```

## Development Conventions

*   **Component Structure**: Components are organized by feature in the `components` directory. Reusable UI components are located in `components/ui`.
*   **Styling**: The project uses Tailwind CSS for utility-first styling.
*   **State Management**: For remote state, the app uses Apollo Client to manage GraphQL data. Local UI state is managed with React hooks.
*   **Authentication**: Authentication is handled via the `AuthProvider`, which provides user information throughout the application.
*   **GraphQL**: GraphQL mutations and queries are defined in the `lib/graphql` directory.
