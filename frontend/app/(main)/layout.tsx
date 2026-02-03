"use client"

import { Menu, Sparkles } from "lucide-react"
import Link from "next/link"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Button } from "@/components/ui/button"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <AppSidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg">ProjectFlow</span>
          </Link>
          {/* Mobile menu trigger would go here - for now simplifying as I need to check for Sheet component */}
          <Button variant="ghost" size="icon">
            <Menu className="w-5 h-5" />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
