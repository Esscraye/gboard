"use client"

import { useQuery } from "@apollo/client/react"
import { motion } from "framer-motion"
import { AlertTriangle, ChevronLeft, Layout } from "lucide-react"
import { useRouter } from "next/navigation"
import { use, useState } from "react"

import { KanbanBoard } from "@/components/board/kanban-board"
import { IssueDetailModal } from "@/components/issues/issue-detail-modal"
import { useAuth } from "@/components/providers/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { GET_BOARD_BY_ID_QUERY } from "@/lib/graphql/queries"
import type { Board, Issue } from "@/types"

export default function BoardPage({ params }: { params: Promise<{ boardId: string }> }) {
  const { boardId } = use(params)
  const { isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)

  const { data, loading, error } = useQuery<{ board: Board }>(GET_BOARD_BY_ID_QUERY, {
    variables: { id: boardId },
    skip: !isAuthenticated,
  })

  const board = data?.board

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssueId(issue.id)
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-16 border-b border-border/50 flex items-center px-6">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-80 space-y-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-[400px] w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <motion.div
          className="max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Failed to load board</h2>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t load the board. Please try again.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => router.push("/boards")}
              className="bg-primary hover:bg-primary/90"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Boards
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  const project = board?.project
  const team = board?.team

  const totalIssues = board?.columns?.reduce((acc, col) => acc + (col.issues?.length || 0), 0) || 0

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-none p-6 pb-2">
        <motion.div
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/boards")}
                className="h-10 w-10 rounded-xl border-border/50 hover:bg-accent"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back to Boards</span>
              </Button>
            </motion.div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{board?.name || "Board"}</h1>
                {project?.key && (
                  <Badge variant="outline" className="font-mono text-xs bg-muted/50">
                    {project.key}
                  </Badge>
                )}
                {team?.name && (
                  <Badge
                    variant="outline"
                    className="font-mono text-xs bg-blue-500/10 text-blue-500 border-blue-200"
                  >
                    {team.name}
                  </Badge>
                )}
              </div>
              {project?.description && (
                <p className="text-sm text-muted-foreground mt-1 max-w-xl truncate">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Layout className="w-4 h-4" />
              <span>{board?.columns?.length || 0} columns</span>
              <span className="text-border">•</span>
              <span>{totalIssues} issues</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 pt-2">
        {loading ? (
          <div className="flex gap-5 h-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-80 space-y-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between px-1 py-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <Skeleton className="h-full w-full rounded-xl" />
              </motion.div>
            ))}
          </div>
        ) : board ? (
          <KanbanBoard
            board={board}
            projectId={project?.id || ""}
            onIssueClick={handleIssueClick}
          />
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
              <Layout className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No board found</h2>
            <p className="text-muted-foreground mb-6">
              This board doesn&apos;t exist or you don&apos;t have access to it.
            </p>
            <Button onClick={() => router.push("/boards")}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Boards
            </Button>
          </motion.div>
        )}
      </div>

      <IssueDetailModal
        issueId={selectedIssueId}
        projectId={project?.id || ""}
        open={!!selectedIssueId}
        onOpenChange={(open) => !open && setSelectedIssueId(null)}
      />
    </div>
  )
}
