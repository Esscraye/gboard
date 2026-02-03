"use client"

import { useQuery } from "@apollo/client/react"
import { motion } from "framer-motion"
import { AlertTriangle, ChevronLeft, Layout, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use, useEffect } from "react"

import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { GET_BOARD_QUERY } from "@/lib/graphql/queries"
import type { Board } from "@/types"

export default function ProjectBoardsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params)
  const { isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  const { data, loading, error } = useQuery<{ boards: Board[] }>(GET_BOARD_QUERY, {
    variables: { projectId },
    skip: !isAuthenticated,
  })

  const boards = data?.boards || []

  // Auto-redirect if only one board
  useEffect(() => {
    if (!loading && boards.length === 1) {
      router.replace(`/board/${boards[0].id}`)
    }
  }, [loading, boards, router])

  if (authLoading || !isAuthenticated || loading) {
    return (
      <div className="container py-8 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[150px] rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold mb-2">Failed to load boards</h2>
        <Button onClick={() => router.push("/")} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  // If redirecting, render minimal content or loading
  if (boards.length === 1) {
    return (
      <div className="container py-8 flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="text-muted-foreground">Opening board...</p>
        </div>
      </div>
    )
  }

  const project = boards.length > 0 ? boards[0].project : null

  return (
    <div className="container py-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="-ml-2 text-muted-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Projects
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{project?.name || "Project Boards"}</h1>
          <p className="text-muted-foreground">
            {boards.length} board{boards.length !== 1 ? "s" : ""} available
          </p>
        </div>
        {/* Potentially add Create Board button here */}
      </div>

      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/25">
          <Layout className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No boards found</h3>
          <p className="text-muted-foreground mb-4">
            This project doesn&apos;t have any boards yet.
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Board
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <Link key={board.id} href={`/board/${board.id}`}>
              <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
                <Card className="h-full hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {board.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Layout className="w-4 h-4" />
                        <span>{board.columns?.length || 0} columns</span>
                      </div>
                      <div className="px-2 py-1 rounded bg-muted text-xs">
                        {board.issues?.length || 0} issues
                        {/* Note: issues count might not be on board object in this query, checking schema */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
