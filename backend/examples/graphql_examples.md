# Exemples de requêtes GraphQL pour GBoard

Ce document contient des exemples de requêtes GraphQL pour tester le backend GBoard.

## Configuration du Playground

1. Lancez les services avec Docker :
```bash
docker-compose up --build
```

2. Accédez au playground GraphQL : http://localhost:8080

## Authentification

### 1. Inscription (Signup)

```graphql
mutation Signup {
  signup(input: {
    email: "user@example.com"
    name: "John Doe"
    username: "johndoe"
    password: "securePassword123!"
  }) {
    token
    refreshToken
    user {
      id
      email
      name
      username
    }
  }
}
```

### 2. Connexion (Login)

```graphql
mutation Login {
  login(email: "user@example.com", password: "securePassword123!") {
    token
    refreshToken
    user {
      id
      email
      name
      username
    }
  }
}
```

### 3. Rafraîchir le token

```graphql
mutation RefreshToken {
  refreshToken(token: "VOTRE_REFRESH_TOKEN") {
    token
    refreshToken
    user {
      id
      email
      name
    }
  }
}
```

## Utilisateurs

### 4. Obtenir l'utilisateur courant (nécessite authentification)

```graphql
query Me {
  me {
    id
    email
    name
    username
    createdAt
    updatedAt
  }
}
```

### 5. Obtenir tous les utilisateurs (nécessite authentification)

```graphql
query Users {
  users {
    id
    email
    name
    username
    createdAt
  }
}
```

## Projets

### 6. Créer un projet (nécessite authentification)

```graphql
mutation CreateProject {
  createProject(input: {
    name: "Mon Premier Projet"
    description: "Description de mon projet"
    key: "MPP"
  }) {
    id
    name
    description
    key
    owner {
      id
      name
      email
    }
    createdAt
    updatedAt
  }
}
```

### 7. Obtenir tous les projets (nécessite authentification)

```graphql
query Projects {
  projects {
    id
    name
    description
    key
    createdAt
    updatedAt
    owner {
      id
      name
      email
    }
    members {
      id
      name
      email
    }
    boards {
      id
      name
    }
  }
}
```

### 8. Obtenir un projet spécifique (nécessite authentification)

```graphql
query Project {
  project(id: "ID_DU_PROJET") {
    id
    name
    description
    key
    createdAt
    updatedAt
    owner {
      id
      name
      email
    }
    members {
      id
      name
      email
    }
    boards {
      id
      name
      columns {
        id
        name
        position
        issues {
          id
          key
          title
          status
        }
      }
    }
  }
}
```

## Boards

### 9. Créer un board (nécessite authentification)

```graphql
mutation CreateBoard {
  createBoard(input: {
    name: "Board Principal"
    projectId: "ID_DU_PROJET"
  }) {
    id
    name
    project {
      id
      name
    }
    createdAt
    updatedAt
  }
}
```

### 10. Obtenir les boards d'un projet (nécessite authentification)

```graphql
query Boards {
  boards(projectId: "ID_DU_PROJET") {
    id
    name
    createdAt
    updatedAt
    columns {
      id
      name
      position
      issues {
        id
        key
        title
        status
        priority
        issueType
      }
    }
  }
}
```

## Colonnes

### 11. Créer une colonne (nécessite authentification)

```graphql
mutation CreateColumn {
  createColumn(input: {
    name: "À faire"
    boardId: "ID_DU_BOARD"
    position: 1
  }) {
    id
    name
    position
    board {
      id
      name
    }
  }
}
```

### 12. Déplacer une colonne (nécessite authentification)

```graphql
mutation MoveColumn {
  moveColumn(id: "ID_DE_LA_COLONNE", newPosition: 2) {
    id
    name
    position
  }
}
```

## Issues

### 13. Créer une issue (nécessite authentification)

```graphql
mutation CreateIssue {
  createIssue(input: {
    title: "Implémenter l'authentification"
    description: "Il faut implémenter l'authentification JWT pour sécuriser l'API"
    projectId: "ID_DU_PROJET"
    boardId: "ID_DU_BOARD"
    columnId: "ID_DE_LA_COLONNE"
    status: TODO
    priority: HIGH
    issueType: TASK
    assigneeId: "ID_DE_L_UTILISATEUR"
  }) {
    id
    key
    title
    description
    status
    priority
    issueType
    reporter {
      id
      name
    }
    assignee {
      id
      name
    }
    createdAt
    updatedAt
  }
}
```

### 14. Obtenir les issues d'un projet (nécessite authentification)

```graphql
query Issues {
  issues(projectId: "ID_DU_PROJET") {
    id
    key
    title
    description
    status
    priority
    issueType
    reporter {
      id
      name
    }
    assignee {
      id
      name
    }
    createdAt
    updatedAt
    comments {
      id
      content
      author {
        id
        name
      }
      createdAt
    }
  }
}
```

### 15. Déplacer une issue (nécessite authentification)

```graphql
mutation MoveIssue {
  moveIssue(id: "ID_DE_L_ISSUE", columnId: "ID_DE_LA_NOUVELLE_COLONNE") {
    id
    key
    title
    column {
      id
      name
    }
  }
}
```

## Commentaires

### 16. Ajouter un commentaire (nécessite authentification)

```graphql
mutation AddComment {
  addComment(input: {
    issueId: "ID_DE_L_ISSUE"
    content: "Ce commentaire est très important pour le suivi de l'issue."
  }) {
    id
    content
    author {
      id
      name
    }
    createdAt
    issue {
      id
      key
      title
    }
  }
}
```

## Utilisation des tokens

Pour les requêtes nécessitant une authentification, ajoutez le token JWT dans les headers :

```json
{
  "Authorization": "Bearer VOTRE_TOKEN_JWT"
}
```

Vous pouvez obtenir un token via les mutations `signup` ou `login`.

## Conseils de test

1. Commencez par créer un utilisateur avec `signup`
2. Utilisez le token retourné pour les requêtes authentifiées
3. Créez un projet, puis un board, puis des colonnes
4. Enfin, créez des issues et des commentaires
5. Expérimentez avec les différentes mutations et requêtes

N'hésitez pas à modifier ces exemples selon vos besoins !