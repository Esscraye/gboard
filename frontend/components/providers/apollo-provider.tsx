"use client"

import { ApolloProvider as BaseApolloProvider } from "@apollo/client/react"
import type React from "react"
import { apolloClient } from "@/lib/apollo-client"

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <BaseApolloProvider client={apolloClient}>{children}</BaseApolloProvider>
}
