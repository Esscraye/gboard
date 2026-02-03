import { ApolloClient, createHttpLink, from, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error"

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8080/query"

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
})

// Auth link to inject JWT token
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      // Handle authentication errors
      if (
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.message.toLowerCase().includes("unauthorized") ||
        err.message.toLowerCase().includes("not authenticated")
      ) {
        // Clear token and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user")
          window.location.href = "/login"
        }
      }
      console.error(`[GraphQL error]: Message: ${err.message}, Path: ${err.path}`)
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
  }
})

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Custom merge policies if needed
        },
      },
      Board: {
        fields: {
          columns: {
            merge(_existing, incoming) {
              return incoming
            },
          },
        },
      },
      Column: {
        fields: {
          issues: {
            merge(_existing, incoming) {
              return incoming
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
})

// Helper to clear cache on logout
export const clearApolloCache = () => {
  apolloClient.clearStore()
}
