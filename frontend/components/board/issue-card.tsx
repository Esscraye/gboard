"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Bug,
  CheckSquare,
  Layers,
  MessageSquare,
  Minus,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Issue, IssueType, Priority } from "@/types"

type IssueCardProps = {
  issue: Issue
  onClick?: () => void
}

const priorityConfig: Record<
  Priority,
  { icon: typeof ArrowUp; color: string; bgColor: string; label: string }
> = {
  HIGHEST: {
    icon: ArrowUp,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    label: "Highest",
  },
  HIGH: { icon: ArrowUp, color: "text-chart-3", bgColor: "bg-chart-3/10", label: "High" },
  MEDIUM: { icon: Minus, color: "text-chart-4", bgColor: "bg-chart-4/10", label: "Medium" },
  LOW: { icon: ArrowDown, color: "text-chart-1", bgColor: "bg-chart-1/10", label: "Low" },
  LOWEST: { icon: ArrowDown, color: "text-muted-foreground", bgColor: "bg-muted", label: "Lowest" },
}

const typeConfig: Record<
  IssueType,
  { icon: typeof Bug; color: string; bgColor: string; borderColor: string }
> = {
  BUG: {
    icon: Bug,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-l-destructive",
  },
  TASK: {
    icon: CheckSquare,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    borderColor: "border-l-chart-1",
  },
  STORY: {
    icon: BookOpen,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
    borderColor: "border-l-chart-5",
  },
  EPIC: {
    icon: Layers,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    borderColor: "border-l-chart-2",
  },
}

export function IssueCard({ issue, onClick }: IssueCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: issue.id,
    data: {
      type: "issue",
      issue,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const PriorityIcon = priorityConfig[issue.priority]?.icon || Minus
  const priorityColor = priorityConfig[issue.priority]?.color || "text-gray-400"
  const priorityBgColor = priorityConfig[issue.priority]?.bgColor || "bg-gray-500/10"

  const TypeIcon = typeConfig[issue.type]?.icon || CheckSquare
  const typeColor = typeConfig[issue.type]?.color || "text-gray-400"
  const typeBgColor = typeConfig[issue.type]?.bgColor || "bg-gray-500/10"
  const typeBorderColor = typeConfig[issue.type]?.borderColor || "border-l-gray-400"

  const assigneeInitials = issue.assignee?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "cursor-grab active:cursor-grabbing transition-all duration-200 border-l-[3px]",
          "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20",
          "bg-card/80 backdrop-blur-sm",
          typeBorderColor,
          isDragging && "opacity-60 shadow-2xl scale-105 rotate-2 z-50"
        )}
        onClick={onClick}
      >
        <CardContent className="p-3.5 space-y-3">
          <p className="text-sm font-medium leading-snug line-clamp-2 text-foreground/90">
            {issue.title}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className={cn("p-1 rounded", typeBgColor)}>
                <TypeIcon className={cn("w-3.5 h-3.5", typeColor)} />
              </div>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono bg-muted/50">
                {issue.key}
              </Badge>
            </div>

            <div className="flex items-center gap-1.5">
              <div className={cn("p-1 rounded", priorityBgColor)}>
                <PriorityIcon className={cn("w-3.5 h-3.5", priorityColor)} />
              </div>
              {issue.comments && issue.comments.length > 0 && (
                <div className="flex items-center gap-0.5 text-muted-foreground">
                  <MessageSquare className="w-3 h-3" />
                  <span className="text-[10px]">{issue.comments.length}</span>
                </div>
              )}
              {assigneeInitials && (
                <Avatar className="h-6 w-6 ring-2 ring-background">
                  <AvatarFallback className="text-[10px] bg-gradient-to-br from-primary/20 to-primary/10 font-medium">
                    {assigneeInitials}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
