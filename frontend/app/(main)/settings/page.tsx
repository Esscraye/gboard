"use client"

import { useMutation, useQuery } from "@apollo/client/react"
import { motion } from "framer-motion"
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  Save,
  User as UserIcon,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { UPDATE_USER_MUTATION } from "@/lib/graphql/mutations"
import { ME_QUERY } from "@/lib/graphql/queries"
import type { User } from "@/types"

export default function SettingsPage() {
  const { user: authUser } = useAuth()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const { data: userData, loading: userLoading } = useQuery<{ me: User }>(ME_QUERY, {
    skip: !authUser,
  })

  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      setMessage({ type: "success", text: "Profile updated successfully!" })
      setPassword("")
      setConfirmPassword("")
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    },
    onError: (error) => {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      })
    },
  })

  // Update local state when data is loaded (in case onCompleted didn't fire due to cache)
  useEffect(() => {
    if (userData?.me) {
      setName(userData.me.name || "")
      setUsername(userData.me.username || "")
      setEmail(userData.me.email || "")
    }
  }, [userData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (password && password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" })
      return
    }

    if (!userData?.me?.id) return

    const input: any = {
      name,
      username,
      email,
    }

    if (password) {
      input.password = password
    }

    try {
      await updateUser({
        variables: {
          id: userData.me.id,
          input,
        },
      })
    } catch (_err) {
      // Error handled in onError callback
    }
  }

  if (userLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details and public profile.</CardDescription>
            </CardHeader>
            <Separator />
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 pt-6">
                {message && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert
                      variant={message.type === "error" ? "destructive" : "default"}
                      className={
                        message.type === "success"
                          ? "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
                          : ""
                      }
                    >
                      {message.type === "error" ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      <AlertTitle>{message.type === "success" ? "Success" : "Error"}</AlertTitle>
                      <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10"
                        placeholder="johndoe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium">Change Password</h3>
                    <Separator className="flex-1" />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          placeholder="Leave blank to keep current"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="px-6 pb-6">
                <Button type="submit" disabled={updateLoading} className="w-full sm:w-auto">
                  {updateLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
