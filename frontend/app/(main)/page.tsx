"use client"

import { motion } from "framer-motion"
import { FolderKanban, Sparkles, TrendingUp, Users } from "lucide-react"
import { CreateProjectModal } from "@/components/projects/create-project-modal"
import { ProjectGrid } from "@/components/projects/project-grid"
import { useAuth } from "@/components/providers/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion"

export default function HomePage() {
  const { isLoading, isAuthenticated, user } = useAuth()

  if (isLoading || !isAuthenticated) {
    return (
      <div className="space-y-8">
        <div className="space-y-3 mb-10">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-5 w-96 rounded-lg" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: "Active Projects",
      value: "12",
      icon: FolderKanban,
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
    {
      label: "Team Members",
      value: "8",
      icon: Users,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      label: "This Week",
      value: "+23%",
      icon: TrendingUp,
      color: "text-chart-5",
      bg: "bg-chart-5/10",
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome section */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <motion.div variants={fadeInUp} className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">
              {user?.name?.split(" ")[0]}
            </span>
          </h1>
        </motion.div>
        <motion.p variants={fadeInUp} className="text-lg text-muted-foreground">
          Here&apos;s what&apos;s happening with your projects today
        </motion.p>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-3"
      >
        {stats.map((stat, _index) => (
          <motion.div
            key={stat.label}
            variants={staggerItem}
            whileHover={{ y: -2, scale: 1.02 }}
            className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Projects section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Your Projects</h2>
            <p className="text-muted-foreground">Manage and organize your work</p>
          </div>
          <CreateProjectModal />
        </div>
        <ProjectGrid />
      </motion.div>
    </div>
  )
}
