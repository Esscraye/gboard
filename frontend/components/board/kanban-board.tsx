"use client"

import { useMutation } from "@apollo/client/react"
import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { motion } from "framer-motion"
import { useCallback, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MOVE_ISSUE_MUTATION } from "@/lib/graphql/mutations"
import { GET_BOARD_BY_ID_QUERY } from "@/lib/graphql/queries"
import type { Board, Column, Issue } from "@/types"
import { CreateColumnForm } from "./create-column-form"
import { KanbanColumn } from "./kanban-column"

type KanbanBoardProps = {
  board: Board
  projectId: string
  onIssueClick: (issue: Issue) => void
}

export function KanbanBoard({ board, projectId, onIssueClick }: KanbanBoardProps) {
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null)

  const [moveIssue] = useMutation(MOVE_ISSUE_MUTATION, {
    refetchQueries: [{ query: GET_BOARD_BY_ID_QUERY, variables: { id: board.id } }],
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const sortedColumns = [...(board.columns || [])].sort((a, b) => a.position - b.position)

  const findColumnByIssueId = useCallback(
    (issueId: string): Column | undefined => {
      return sortedColumns.find((col) => col.issues?.some((issue) => issue.id === issueId))
    },
    [sortedColumns]
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeData = active.data.current

    if (activeData?.type === "issue") {
      setActiveIssue(activeData.issue)
    }
  }

  const handleDragOver = (_event: DragOverEvent) => {
    // Handle drag over logic if needed for visual feedback
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    setActiveIssue(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeColumn = findColumnByIssueId(activeId)
    let targetColumn: Column | undefined

    // Check if dropped on a column directly
    const isOverColumn = sortedColumns.some((col) => col.id === overId)
    if (isOverColumn) {
      targetColumn = sortedColumns.find((col) => col.id === overId)
    } else {
      // Dropped on another issue
      targetColumn = findColumnByIssueId(overId)
    }

    if (!activeColumn || !targetColumn) return

    // Calculate new position
    const targetIssues = targetColumn.issues || []
    let _newPosition = 0

    if (isOverColumn) {
      // Dropped on empty column or bottom of column
      _newPosition = targetIssues.length
    } else {
      // Dropped on another issue
      const overIssue = targetIssues.find((i) => i.id === overId)
      if (overIssue) {
        _newPosition = overIssue.position
      }
    }

    // Only update if column changed (allow reordering within same column visually,
    // but backend only tracks column changes for now)
    if (activeColumn.id !== targetColumn.id) {
      await moveIssue({
        variables: {
          id: activeId,
          columnId: targetColumn.id,
        },
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        className="flex gap-5 overflow-x-auto pb-6 px-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {sortedColumns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            projectId={projectId}
            boardId={board.id}
            onIssueClick={onIssueClick}
          />
        ))}
        <CreateColumnForm
          boardId={board.id}
          projectId={projectId}
          columnCount={sortedColumns.length}
        />
      </motion.div>

      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeIssue && (
          <motion.div
            className="w-80"
            initial={{ scale: 1.05, rotate: 3 }}
            animate={{ scale: 1.05, rotate: 3 }}
          >
            <Card className="shadow-2xl shadow-black/20 border-primary/30 ring-2 ring-primary/20">
              <CardContent className="p-3.5 space-y-3">
                <p className="text-sm font-medium leading-snug line-clamp-2">{activeIssue.title}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                    {activeIssue.key}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
