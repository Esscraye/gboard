"use client"

import { useQuery } from "@apollo/client/react"
import { motion } from "framer-motion"
import { FolderPlus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { GET_PROJECTS_QUERY } from "@/lib/graphql/queries"
import type { Project } from "@/types"
import { ProjectCard } from "./project-card"

export function ProjectGrid() {
  const { data, loading, error, refetch } = useQuery<{ projects: Project[] }>(GET_PROJECTS_QUERY)

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Skeleton className="h-[200px] rounded-2xl" />
          </motion.div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <RefreshCw className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Failed to load projects</h3>
        <p className="text-muted-foreground text-center mb-4">
          Something went wrong while fetching your projects.
        </p>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try again
        </Button>
      </motion.div>
    )
  }

  if (!data?.projects?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <motion.div
          className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FolderPlus className="w-10 h-10 text-primary" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Create your first project to start organizing your work and collaborating with your team.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  )
}
