"use client"

import { useMutation, useQuery } from "@apollo/client/react"
import { AnimatePresence, motion } from "framer-motion"
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BookOpen,
  Bug,
  Calendar,
  CheckSquare,
  FileText,
  Layers,
  Loader2,
  Minus,
  Trash2,
  User,
} from "lucide-react"
import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { DELETE_ISSUE_MUTATION, UPDATE_ISSUE_MUTATION } from "@/lib/graphql/mutations"
import { GET_BOARD_QUERY, GET_ISSUE_QUERY, GET_USERS_QUERY } from "@/lib/graphql/queries"
import { cn } from "@/lib/utils"
import {
  type Issue,
  IssueStatus,
  type IssueType,
  type Priority,
  type User as UserType,
} from "@/types"
import { CommentsSection } from "./comments-section"

type IssueDetailModalProps = {
  issueId: string | null
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const typeConfig: Record<
  IssueType,
  { icon: typeof Bug; color: string; bgColor: string; label: string }
> = {
  BUG: { icon: Bug, color: "text-red-500", bgColor: "bg-red-500/10", label: "Bug" },
  TASK: { icon: CheckSquare, color: "text-blue-500", bgColor: "bg-blue-500/10", label: "Task" },
  STORY: { icon: BookOpen, color: "text-green-500", bgColor: "bg-green-500/10", label: "Story" },
  EPIC: { icon: Layers, color: "text-purple-500", bgColor: "bg-purple-500/10", label: "Epic" },
}

const priorityConfig: Record<Priority, { icon: typeof ArrowUp; color: string; label: string }> = {
  HIGHEST: { icon: ArrowUp, color: "text-red-600", label: "Highest" },
  HIGH: { icon: ArrowUp, color: "text-orange-500", label: "High" },
  MEDIUM: { icon: Minus, color: "text-yellow-500", label: "Medium" },
  LOW: { icon: ArrowDown, color: "text-blue-500", label: "Low" },
  LOWEST: { icon: ArrowDown, color: "text-gray-400", label: "Lowest" },
}

const statusConfig: Record<IssueStatus, { color: string; bgColor: string }> = {
  BACKLOG: { color: "text-slate-600", bgColor: "bg-slate-500/10" },
  TODO: { color: "text-blue-600", bgColor: "bg-blue-500/10" },
  IN_PROGRESS: { color: "text-amber-600", bgColor: "bg-amber-500/10" },
  IN_REVIEW: { color: "text-purple-600", bgColor: "bg-purple-500/10" },
  DONE: { color: "text-green-600", bgColor: "bg-green-500/10" },
}

export function IssueDetailModal({
  issueId,
  projectId,
  open,
  onOpenChange,
}: IssueDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data, loading } = useQuery<{ issue: Issue }>(GET_ISSUE_QUERY, {
    variables: { id: issueId },
    skip: !issueId,
  })

  const { data: usersData } = useQuery<{ users: UserType[] }>(GET_USERS_QUERY)

  const [updateIssue, { loading: updating }] = useMutation(UPDATE_ISSUE_MUTATION, {
    refetchQueries: [
      { query: GET_ISSUE_QUERY, variables: { id: issueId } },
      { query: GET_BOARD_QUERY, variables: { projectId } },
    ],
  })

  const [deleteIssue, { loading: deleting }] = useMutation(DELETE_ISSUE_MUTATION, {
    refetchQueries: [{ query: GET_BOARD_QUERY, variables: { projectId } }],
    onCompleted: () => {
      onOpenChange(false)
    },
  })

  const issue = data?.issue

  useEffect(() => {
    if (issue) {
      setEditTitle(issue.title)
      setEditDescription(issue.description || "")
    }
  }, [issue])

  const handleSaveTitle = async () => {
    if (!issue || editTitle.trim() === issue.title) {
      setIsEditing(false)
      return
    }

    await updateIssue({
      variables: {
        id: issue.id,
        input: { title: editTitle.trim() },
      },
    })
    setIsEditing(false)
  }

  const handleSaveDescription = async () => {
    if (!issue) return

    await updateIssue({
      variables: {
        id: issue.id,
        input: { description: editDescription.trim() || null },
      },
    })
  }

  const handleFieldUpdate = async (field: string, value: string | null) => {
    if (!issue) return

    await updateIssue({
      variables: {
        id: issue.id,
        input: { [field]: value },
      },
    })
  }

  const handleDelete = async () => {
    if (!issue) return
    await deleteIssue({ variables: { id: issue.id } })
  }

  const TypeIcon = issue?.type ? typeConfig[issue.type]?.icon : CheckSquare
  const typeColor = issue?.type ? typeConfig[issue.type]?.color : "text-gray-400"
  const typeBgColor = issue?.type ? typeConfig[issue.type]?.bgColor : "bg-gray-500/10"

  const reporterInitials = issue?.reporter?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const assigneeInitials = issue?.assignee?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 bg-card/95 backdrop-blur-xl border-border/50">
          {loading ? (
            <div className="p-8 space-y-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ) : issue ? (
            <>
              <DialogHeader className="p-6 pb-0 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                        typeBgColor
                      )}
                    >
                      <TypeIcon className={cn("w-6 h-6", typeColor)} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <Input
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={handleSaveTitle}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveTitle()
                            if (e.key === "Escape") {
                              setEditTitle(issue.title)
                              setIsEditing(false)
                            }
                          }}
                          className="text-xl font-semibold h-auto py-1 bg-background/50"
                          disabled={updating}
                        />
                      ) : (
                        <DialogTitle
                          className="text-xl font-semibold cursor-pointer hover:bg-muted/50 px-2 py-1 -mx-2 rounded-lg transition-colors"
                          onClick={() => setIsEditing(true)}
                        >
                          {issue.title}
                        </DialogTitle>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs font-mono bg-muted/50">
                          {issue.key}
                        </Badge>
                        <Badge
                          className={cn(
                            "text-xs",
                            statusConfig[issue.status]?.bgColor,
                            statusConfig[issue.status]?.color
                          )}
                          variant="secondary"
                        >
                          {issue.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </DialogHeader>

              <div className="p-6 space-y-6">
                {/* Description */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Description
                  </Label>
                  <Textarea
                    placeholder="Add a description..."
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    onBlur={handleSaveDescription}
                    rows={4}
                    className="resize-none bg-background/50 border-border/50"
                    disabled={updating}
                  />
                </div>

                {/* Fields Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <Select
                      value={issue.status}
                      onValueChange={(v) => handleFieldUpdate("status", v)}
                      disabled={updating}
                    >
                      <SelectTrigger className="h-11 bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={IssueStatus.BACKLOG}>Backlog</SelectItem>
                        <SelectItem value={IssueStatus.TODO}>To Do</SelectItem>
                        <SelectItem value={IssueStatus.IN_PROGRESS}>In Progress</SelectItem>
                        <SelectItem value={IssueStatus.IN_REVIEW}>In Review</SelectItem>
                        <SelectItem value={IssueStatus.DONE}>Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Priority</Label>
                    <Select
                      value={issue.priority}
                      onValueChange={(v) => handleFieldUpdate("priority", v)}
                      disabled={updating}
                    >
                      <SelectTrigger className="h-11 bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(priorityConfig).map(([key, config]) => {
                          const Icon = config.icon
                          return (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <Icon className={cn("w-4 h-4", config.color)} />
                                {config.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Type</Label>
                    <Select
                      value={issue.type}
                      onValueChange={(v) => handleFieldUpdate("type", v)}
                      disabled={updating}
                    >
                      <SelectTrigger className="h-11 bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(typeConfig).map(([key, config]) => {
                          const Icon = config.icon
                          return (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <Icon className={cn("w-4 h-4", config.color)} />
                                {config.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Assignee
                    </Label>
                    <Select
                      value={issue.assigneeId || "unassigned"}
                      onValueChange={(v) =>
                        handleFieldUpdate("assigneeId", v === "unassigned" ? null : v)
                      }
                      disabled={updating}
                    >
                      <SelectTrigger className="h-11 bg-background/50">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {usersData?.users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Reporter Info */}
                <div className="flex items-center gap-6 p-4 rounded-xl bg-muted/30 text-sm">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-2 ring-background">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10">
                        {reporterInitials || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs text-muted-foreground">Reporter</p>
                      <p className="font-medium">{issue.reporter?.name}</p>
                    </div>
                  </div>
                  {issue.assignee && (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 ring-2 ring-background">
                        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500/20 to-blue-500/10">
                          {assigneeInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs text-muted-foreground">Assignee</p>
                        <p className="font-medium">{issue.assignee.name}</p>
                      </div>
                    </div>
                  )}
                  {issue.createdAt && (
                    <div className="flex items-center gap-2 ml-auto text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">
                        Created {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Comments */}
                <CommentsSection issueId={issue.id} comments={issue.comments || []} />
              </div>

              <AnimatePresence>
                {updating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg"
                  >
                    <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-lg">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm">Saving...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Issue not found</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-border/50">
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <Trash2 className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle>Delete issue?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong className="text-foreground">{issue?.key}</strong>{" "}
              and all its comments. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="h-11">
              Cancel
            </AlertDialogCancel>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </AlertDialogAction>
            </motion.div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
