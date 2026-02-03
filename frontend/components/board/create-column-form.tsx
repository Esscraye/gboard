"use client"

import { useMutation } from "@apollo/client/react"
import { AnimatePresence, motion } from "framer-motion"
import { Columns, Loader2, Plus, X } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CREATE_COLUMN_MUTATION } from "@/lib/graphql/mutations"
import { GET_BOARD_BY_ID_QUERY } from "@/lib/graphql/queries"
import type { Column } from "@/types"

type CreateColumnFormProps = {
  boardId: string
  projectId: string
  columnCount: number
}

export function CreateColumnForm({ boardId, projectId, columnCount }: CreateColumnFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")

  const [createColumn, { loading }] = useMutation<{ createColumn: Column }>(
    CREATE_COLUMN_MUTATION,
    {
      refetchQueries: [{ query: GET_BOARD_BY_ID_QUERY, variables: { id: boardId } }],
      onCompleted: () => {
        setName("")
        setIsEditing(false)
      },
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    await createColumn({
      variables: {
        input: {
          name: name.trim(),
          boardId,
          position: columnCount + 1,
        },
      },
    })
  }

  return (
    <AnimatePresence mode="wait">
      {!isEditing ? (
        <motion.div
          key="button"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="w-80 h-12 justify-start text-muted-foreground border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all"
              onClick={() => setIsEditing(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add column
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className="w-80 shrink-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="rounded-xl bg-gradient-to-b from-muted/80 to-muted/50 border border-border/50 p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
              <Columns className="w-4 h-4 text-primary" />
              New column
            </div>
            <Input
              autoFocus
              placeholder="Enter column name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="h-11 bg-background/80"
            />
            <div className="flex items-center gap-2">
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading || !name.trim()}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="mr-1.5 h-4 w-4" />
                      Add
                    </>
                  )}
                </Button>
              </motion.div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
