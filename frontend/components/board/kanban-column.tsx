"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { AnimatePresence, motion } from "framer-motion"
import { Inbox, MoreHorizontal, Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Column, Issue } from "@/types"
import { CreateIssueModal } from "./create-issue-modal"
import { IssueCard } from "./issue-card"

type KanbanColumnProps = {
  column: Column
  projectId: string
  boardId: string
  onIssueClick: (issue: Issue) => void
}

const columnColors = [
  {
    bg: "from-chart-1/10 to-chart-1/5",
    border: "border-chart-1/20",
    badge: "bg-chart-1/20 text-chart-1",
  },
  {
    bg: "from-chart-2/10 to-chart-2/5",
    border: "border-chart-2/20",
    badge: "bg-chart-2/20 text-chart-2",
  },
  {
    bg: "from-chart-3/10 to-chart-3/5",
    border: "border-chart-3/20",
    badge: "bg-chart-3/20 text-chart-3",
  },
  {
    bg: "from-chart-4/10 to-chart-4/5",
    border: "border-chart-4/20",
    badge: "bg-chart-4/20 text-chart-4",
  },
  {
    bg: "from-chart-5/10 to-chart-5/5",
    border: "border-chart-5/20",
    badge: "bg-chart-5/20 text-chart-5",
  },
]

export function KanbanColumn({ column, projectId, boardId, onIssueClick }: KanbanColumnProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  })

  const sortedIssues = [...(column.issues || [])].sort((a, b) => a.position - b.position)
  const colorIndex = column.position % columnColors.length
  const colors = columnColors[colorIndex]

  return (
    <motion.div
      className="flex flex-col w-80 shrink-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: column.position * 0.1 }}
    >
      <div className="flex items-center justify-between px-1 py-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-sm tracking-wide">{column.name}</h3>
          <span
            className={cn(
              "flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-medium",
              colors.badge
            )}
          >
            {sortedIssues.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add issue</span>
            </Button>
          </motion.div>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Column options</span>
          </Button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 rounded-xl p-2 space-y-2 min-h-[300px] transition-all duration-300",
          "bg-gradient-to-b border",
          colors.bg,
          colors.border,
          isOver && "ring-2 ring-primary/40 bg-primary/5 scale-[1.02]"
        )}
      >
        <SortableContext
          items={sortedIssues.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence mode="popLayout">
            {sortedIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} onClick={() => onIssueClick(issue)} />
            ))}
          </AnimatePresence>
        </SortableContext>

        {sortedIssues.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center h-32 text-sm text-muted-foreground gap-2 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
            <p>No issues yet</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary hover:text-primary/80 pointer-events-auto"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add first issue
            </Button>
          </motion.div>
        )}
      </div>

      <CreateIssueModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        columnId={column.id}
        projectId={projectId}
        boardId={boardId}
      />
    </motion.div>
  )
}
