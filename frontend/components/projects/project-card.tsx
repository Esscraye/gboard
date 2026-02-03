"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Calendar, Folder, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Project } from "@/types"

type ProjectCardProps = {
  project: Project
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const router = useRouter()

  const leadInitials = project.lead?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Using theme variables mapped to chart colors for project variety
  const gradients = [
    "from-chart-1/10 to-chart-2/10",
    "from-chart-2/10 to-chart-3/10",
    "from-chart-3/10 to-chart-4/10",
    "from-chart-4/10 to-chart-5/10",
    "from-chart-5/10 to-chart-1/10",
  ]

  const iconColors = [
    "text-chart-1",
    "text-chart-2",
    "text-chart-3",
    "text-chart-4",
    "text-chart-5",
  ]

  const gradient = gradients[index % gradients.length]
  const iconColor = iconColors[index % iconColors.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`group cursor-pointer overflow-hidden border-border/50 bg-gradient-to-br ${gradient} hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300`}
        onClick={() => {
          if (project.boards && project.boards.length > 0) {
            router.push(`/board/${project.boards[0].id}`)
          } else {
            router.push("/boards")
          }
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className={`flex items-center justify-center w-12 h-12 rounded-xl bg-background/80 ${iconColor} shadow-sm`}
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <Folder className="w-6 h-6" />
              </motion.div>
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                  {project.name}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-background/60 backdrop-blur-sm font-mono text-xs"
                >
                  {project.key}
                </Badge>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="p-2 rounded-lg bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ArrowUpRight className="w-4 h-4" />
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.description && (
            <CardDescription className="line-clamp-2 text-sm leading-relaxed">
              {project.description}
            </CardDescription>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7 border-2 border-background">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                  {leadInitials || "?"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {project.lead?.name || "No lead"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex items-center gap-1.5 text-xs">
                <Users className="w-3.5 h-3.5" />
                <span>{project.members?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
