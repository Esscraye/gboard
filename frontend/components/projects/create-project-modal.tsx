"use client"

import { useMutation } from "@apollo/client/react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, FileText, FolderPlus, Hash, Loader2, Plus, Sparkles } from "lucide-react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CREATE_PROJECT_MUTATION } from "@/lib/graphql/mutations"
import { GET_PROJECTS_QUERY } from "@/lib/graphql/queries"
import type { Project } from "@/types"

export function CreateProjectModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [key, setKey] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const [createProject, { loading }] = useMutation<{ createProject: Project }>(
    CREATE_PROJECT_MUTATION,
    {
      refetchQueries: [{ query: GET_PROJECTS_QUERY }],
      onCompleted: () => {
        setOpen(false)
        resetForm()
      },
      onError: (err) => {
        setError(err.message)
      },
    }
  )

  const resetForm = () => {
    setName("")
    setKey("")
    setDescription("")
    setError(null)
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!key || key === generateKey(name)) {
      setKey(generateKey(value))
    }
  }

  const generateKey = (text: string) => {
    return text
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 4)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !key.trim()) {
      setError("Name and key are required")
      return
    }

    await createProject({
      variables: {
        input: {
          name: name.trim(),
          key: key.toUpperCase().trim(),
          description: description.trim() || undefined,
        },
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="gap-2 bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </motion.div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-border/50">
        <div className="p-6 pb-0">
          <DialogHeader className="space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center shadow-lg shadow-primary/25"
            >
              <FolderPlus className="w-7 h-7 text-primary-foreground" />
            </motion.div>
            <div>
              <DialogTitle className="text-2xl font-bold">Create project</DialogTitle>
              <DialogDescription className="text-base">
                Organize your work with a new Kanban board
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
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Project name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  placeholder="My awesome project"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  className={`h-12 bg-background/50 border-border/50 transition-all duration-200 ${
                    focusedField === "name" ? "border-primary/50 ring-2 ring-primary/20" : ""
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="key" className="text-sm font-medium flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                Project key
              </Label>
              <div className="relative">
                <Input
                  id="key"
                  placeholder="PROJ"
                  value={key}
                  onChange={(e) => setKey(e.target.value.toUpperCase().slice(0, 6))}
                  onFocus={() => setFocusedField("key")}
                  onBlur={() => setFocusedField(null)}
                  maxLength={6}
                  disabled={loading}
                  className={`h-12 bg-background/50 border-border/50 font-mono transition-all duration-200 ${
                    focusedField === "key" ? "border-primary/50 ring-2 ring-primary/20" : ""
                  }`}
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                Used as prefix for issues (e.g.,{" "}
                <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
                  {key || "PROJ"}-1
                </code>
                )
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Description
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what this project is about..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setFocusedField("description")}
                onBlur={() => setFocusedField(null)}
                rows={3}
                disabled={loading}
                className={`bg-background/50 border-border/50 resize-none transition-all duration-200 ${
                  focusedField === "description" ? "border-primary/50 ring-2 ring-primary/20" : ""
                }`}
              />
            </div>
          </div>

          <DialogFooter className="p-6 pt-0 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <motion.div className="flex-1" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                disabled={loading || !name.trim() || !key.trim()}
                className="w-full h-11 bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90 shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create project
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
