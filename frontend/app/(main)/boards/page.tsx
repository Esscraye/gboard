"use client"

import { useMutation, useQuery } from "@apollo/client/react"
import { motion } from "framer-motion"
import { ArrowRight, KanbanSquare, Layout, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { CREATE_BOARD_MUTATION } from "@/lib/graphql/mutations"
import { GET_PROJECTS_QUERY } from "@/lib/graphql/queries"
import type { Board, Project } from "@/types"

export default function BoardsIndexPage() {
  const { data, loading } = useQuery<{ projects: Project[] }>(GET_PROJECTS_QUERY)
  const router = useRouter()

  if (loading) {
    return (
      <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  const projects = data?.projects || []

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold tracking-tight">Boards</h1>
          <p className="text-muted-foreground">View and manage boards across all your projects.</p>
        </motion.div>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/30"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Layout className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No projects found</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-sm">
              You need to join or create a project before you can view boards.
            </p>
            <Button onClick={() => router.push("/")}>Go to Dashboard</Button>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectBoardsCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectBoardsCard({ project, index }: { project: Project; index: number }) {
  const router = useRouter()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newBoardName, setNewBoardName] = useState("")

  const [createBoard, { loading: createLoading }] = useMutation<{ createBoard: Board }>(
    CREATE_BOARD_MUTATION,
    {
      refetchQueries: [{ query: GET_PROJECTS_QUERY }],
      onCompleted: (data) => {
        setIsCreateOpen(false)
        setNewBoardName("")
        if (data?.createBoard?.id) {
          router.push(`/boards/${project.id}`)
        }
      },
    }
  )

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBoardName.trim()) return

    try {
      await createBoard({
        variables: {
          input: {
            name: newBoardName,
            projectId: project.id,
          },
        },
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="truncate">{project.name}</CardTitle>
            <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
              {project.key}
            </span>
          </div>
          <CardDescription className="line-clamp-2 min-h-[40px]">
            {project.description || "No description provided."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <KanbanSquare className="w-4 h-4" />
              <span>{project.boards?.length || 0} Boards</span>
            </div>

            <div className="space-y-2">
              {project.boards?.slice(0, 3).map((board) => (
                <Link
                  key={board.id}
                  href={`/boards/${project.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 group"
                >
                  <span className="text-sm font-medium truncate">{board.name}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
              {(project.boards?.length || 0) > 3 && (
                <div className="text-xs text-muted-foreground pl-2">
                  + {(project.boards?.length || 0) - 3} more
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4 border-t bg-muted/20">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Board
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Board</DialogTitle>
                <DialogDescription>
                  Add a new board to <strong>{project.name}</strong> to track tasks.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateBoard}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Board Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Kanban Board, Sprint 1"
                      value={newBoardName}
                      onChange={(e) => setNewBoardName(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createLoading || !newBoardName.trim()}>
                    {createLoading && <Plus className="mr-2 h-4 w-4 animate-spin" />}
                    Create Board
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
