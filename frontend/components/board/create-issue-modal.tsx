"use client"

import { useMutation, useQuery } from "@apollo/client/react"
import { AnimatePresence, motion } from "framer-motion"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  BookOpen,
  Bug,
  CheckSquare,
  FileText,
  Layers,
  Loader2,
  Minus,
  Sparkles,
  User,
} from "lucide-react"
import type React from "react"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CREATE_ISSUE_MUTATION } from "@/lib/graphql/mutations"
import { GET_BOARD_BY_ID_QUERY, GET_USERS_QUERY } from "@/lib/graphql/queries"
import { cn } from "@/lib/utils"
import { type Issue, IssueType, Priority, type User as UserType } from "@/types"

type CreateIssueModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  columnId: string
  projectId: string
  boardId: string
}

const typeOptions = [
  {
    value: IssueType.TASK,
    label: "Task",
    icon: CheckSquare,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  { value: IssueType.BUG, label: "Bug", icon: Bug, color: "text-red-500", bg: "bg-red-500/10" },
  {
    value: IssueType.STORY,
    label: "Story",
    icon: BookOpen,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    value: IssueType.EPIC,
    label: "Epic",
    icon: Layers,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
]

const priorityOptions = [
  { value: Priority.HIGHEST, label: "Highest", icon: ArrowUp, color: "text-red-600" },
  { value: Priority.HIGH, label: "High", icon: ArrowUp, color: "text-orange-500" },
  { value: Priority.MEDIUM, label: "Medium", icon: Minus, color: "text-yellow-500" },
  { value: Priority.LOW, label: "Low", icon: ArrowDown, color: "text-blue-500" },
  { value: Priority.LOWEST, label: "Lowest", icon: ArrowDown, color: "text-gray-400" },
]

export function CreateIssueModal({
  open,
  onOpenChange,
  columnId,
  projectId,
  boardId,
}: CreateIssueModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<IssueType>(IssueType.TASK)
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM)
  const [assigneeId, setAssigneeId] = useState<string>("unassigned")
  const [error, setError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const { data: usersData } = useQuery<{ users: UserType[] }>(GET_USERS_QUERY)

  const [createIssue, { loading }] = useMutation<{ createIssue: Issue }>(CREATE_ISSUE_MUTATION, {
    refetchQueries: [{ query: GET_BOARD_BY_ID_QUERY, variables: { id: boardId } }],
    onCompleted: () => {
      onOpenChange(false)
      resetForm()
    },
    onError: (err) => {
      setError(err.message)
    },
  })

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setType(IssueType.TASK)
    setPriority(Priority.MEDIUM)
    setAssigneeId("unassigned")
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    await createIssue({
      variables: {
        input: {
          title: title.trim(),
          description: description.trim() || undefined,
          issueType: type,
          priority,
          projectId,
          boardId,
          columnId,
          assigneeId: assigneeId === "unassigned" ? undefined : assigneeId,
        },
      },
    })
  }

  const selectedType = typeOptions.find((t) => t.value === type)
  const TypeIcon = selectedType?.icon || CheckSquare

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-border/50">
        <div className="p-6 pb-0">
          <DialogHeader className="space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                selectedType?.bg || "bg-blue-500/10"
              )}
            >
              <TypeIcon className={cn("w-7 h-7", selectedType?.color || "text-blue-500")} />
            </motion.div>
            <div>
              <DialogTitle className="text-2xl font-bold">Create issue</DialogTitle>
              <DialogDescription className="text-base">
                Add a new task to track your work
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                >
                  <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Title
              </Label>
              <Input
                id="title"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setFocusedField("title")}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
                className={cn(
                  "h-12 bg-background/50 border-border/50 transition-all duration-200",
                  focusedField === "title" && "border-primary/50 ring-2 ring-primary/20"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Description
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Add more details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setFocusedField("description")}
                onBlur={() => setFocusedField(null)}
                rows={3}
                disabled={loading}
                className={cn(
                  "bg-background/50 border-border/50 resize-none transition-all duration-200",
                  focusedField === "description" && "border-primary/50 ring-2 ring-primary/20"
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Type
                </Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as IssueType)}
                  disabled={loading}
                >
                  <SelectTrigger id="type" className="h-11 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className={cn("w-4 h-4", option.color)} />
                            {option.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as Priority)}
                  disabled={loading}
                >
                  <SelectTrigger id="priority" className="h-11 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className={cn("w-4 h-4", option.color)} />
                            {option.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee" className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Assignee
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Select value={assigneeId} onValueChange={setAssigneeId} disabled={loading}>
                <SelectTrigger id="assignee" className="h-11 bg-background/50">
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

          <DialogFooter className="p-6 pt-0 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <motion.div className="flex-1" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                disabled={loading || !title.trim()}
                className="w-full h-11 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create issue
                  </>
                )}
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
