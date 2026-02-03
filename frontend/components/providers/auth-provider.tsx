"use client"

import { useMutation } from "@apollo/client/react"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { apolloClient, clearApolloCache } from "@/lib/apollo-client"
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "@/lib/graphql/mutations"
import { ME_QUERY } from "@/lib/graphql/queries"
import type { AuthPayload, LoginInput, SignupInput, User } from "@/types"

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (input: LoginInput) => Promise<{ success: boolean; error?: string }>
  signup: (input: SignupInput) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const PUBLIC_ROUTES = ["/login", "/signup"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const [loginMutation] = useMutation<{ login: AuthPayload }>(LOGIN_MUTATION)
  const [signupMutation] = useMutation<{ signup: AuthPayload }>(SIGNUP_MUTATION)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token")
      const storedUser = localStorage.getItem("user")

      if (token && storedUser) {
        try {
          // Verify token by fetching current user
          const { data } = await apolloClient.query<{ me: User }>({
            query: ME_QUERY,
            fetchPolicy: "network-only",
          })
          if (data?.me) {
            setUser(data.me)
            localStorage.setItem("user", JSON.stringify(data.me))
          } else {
            // Token invalid, clear storage
            localStorage.removeItem("auth_token")
            localStorage.removeItem("user")
          }
        } catch {
          // Token invalid
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Redirect based on auth state
  useEffect(() => {
    if (isLoading) return

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
    const isAuthenticated = !!user

    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login")
    } else if (isAuthenticated && isPublicRoute) {
      router.push("/")
    }
  }, [user, isLoading, pathname, router])

  const login = useCallback(
    async (input: LoginInput): Promise<{ success: boolean; error?: string }> => {
      try {
        const { data } = await loginMutation({
          variables: {
            email: input.email,
            password: input.password,
          },
        })
        if (data?.login) {
          localStorage.setItem("auth_token", data.login.token)
          localStorage.setItem("user", JSON.stringify(data.login.user))
          setUser(data.login.user)
          return { success: true }
        }
        return { success: false, error: "Login failed" }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed"
        return { success: false, error: message }
      }
    },
    [loginMutation]
  )

  const signup = useCallback(
    async (input: SignupInput): Promise<{ success: boolean; error?: string }> => {
      try {
        const { data } = await signupMutation({ variables: { input } })
        if (data?.signup) {
          localStorage.setItem("auth_token", data.signup.token)
          localStorage.setItem("user", JSON.stringify(data.signup.user))
          setUser(data.signup.user)
          return { success: true }
        }
        return { success: false, error: "Signup failed" }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Signup failed"
        return { success: false, error: message }
      }
    },
    [signupMutation]
  )

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    setUser(null)
    clearApolloCache()
    router.push("/login")
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
