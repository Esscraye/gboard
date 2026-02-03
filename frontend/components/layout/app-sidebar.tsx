"use client"

import { motion } from "framer-motion"
import {
  ChevronLeft,
  FolderKanban,
  Home,
  LogOut,
  Menu,
  Plus,
  Settings,
  Sparkles,
  User,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { CreateProjectModal } from "@/components/projects/create-project-modal"
import { useAuth } from "@/components/providers/auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const [collapsed, setCollapsed] = React.useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Auto-collapse on mobile (simple check)
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true)
      } else {
        setCollapsed(false)
      }
    }

    // Initial check
    if (typeof window !== "undefined") {
      handleResize()
      window.addEventListener("resize", handleResize)
    }

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
      variant: "default",
    },
    {
      title: "Boards",
      href: "/boards", // This might need adjustment if boards is dynamic, but usually a list page
      icon: FolderKanban,
      variant: "ghost",
    },
    {
      title: "Teams",
      href: "/teams",
      icon: Users,
      variant: "ghost",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      variant: "ghost",
    },
  ]

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? 80 : 280,
      }}
      className={cn(
        "relative flex flex-col h-screen border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out z-40 hidden md:flex"
      )}
    >
      {/* Sidebar Header */}
      <div
        className={cn(
          "flex items-center h-16 px-6",
          collapsed ? "justify-center px-0" : "justify-between"
        )}
      >
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center min-w-8 w-8 h-8 rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-lg whitespace-nowrap"
            >
              ProjectFlow
            </motion.span>
          )}
        </Link>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-sidebar-foreground/50 hover:text-sidebar-foreground"
            onClick={() => setCollapsed(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 mb-1",
                  collapsed ? "justify-center px-0" : "px-4",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
                {!collapsed && <span>{item.title}</span>}
              </Button>
            </Link>
          )
        })}
      </div>

      {/* Action Button (Create Project) - Optional */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <CreateProjectModal
            trigger={
              <Button className="w-full gap-2 shadow-sm">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            }
          />
        </div>
      )}

      <Separator className="bg-sidebar-border" />

      {/* User Footer */}
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full h-auto p-2 gap-3 hover:bg-sidebar-accent",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <Avatar className="h-8 w-8 border border-sidebar-border">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col items-start text-left overflow-hidden">
                  <span className="text-sm font-medium truncate w-full">{user?.name}</span>
                  <span className="text-xs text-sidebar-foreground/60 truncate w-full">
                    {user?.email}
                  </span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 mb-2 bg-sidebar border-sidebar-border text-sidebar-foreground"
            align="start"
            side="right"
          >
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer gap-2 text-destructive focus:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Collapse toggle for mobile/tablet if needed, or desktop expand */}
        {collapsed && (
          <div className="mt-2 flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-sidebar-foreground/50"
              onClick={() => setCollapsed(false)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.aside>
  )
}
