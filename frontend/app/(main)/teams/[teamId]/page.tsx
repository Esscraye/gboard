"use client"

import { useQuery } from "@apollo/client/react"
import { motion } from "framer-motion"
import { ArrowLeft, KanbanSquare, Layout, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { GET_TEAM_QUERY } from "@/lib/graphql/queries"
import type { Team } from "@/types"

export default function TeamDetailsPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = use(params)
  const router = useRouter()

  const { data, loading, error } = useQuery<{ team: Team }>(GET_TEAM_QUERY, {
    variables: { id: teamId },
  })

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !data?.team) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold mb-2">Team not found</h2>
        <Button onClick={() => router.push("/teams")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teams
        </Button>
      </div>
    )
  }

  const team = data.team

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Button
            variant="ghost"
            className="pl-0 hover:bg-transparent hover:text-primary"
            onClick={() => router.push("/teams")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Teams
          </Button>

          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              {team.name}
            </h1>
            {team.description && (
              <p className="text-muted-foreground mt-2 text-lg">{team.description}</p>
            )}
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Team Board
                </CardTitle>
                <CardDescription>Access the default board for this team.</CardDescription>
              </CardHeader>
              <CardContent>
                {team.defaultBoard ? (
                  <Link href={`/board/${team.defaultBoard.id}`}>
                    <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <KanbanSquare className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{team.defaultBoard.name}</span>
                      </div>
                      <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </Link>
                ) : (
                  <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg text-center">
                    No default board assigned.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Members
                </CardTitle>
                <CardDescription>People in this team ({team.members?.length || 0})</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.members?.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary uppercase">
                        {member.name.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{member.name}</div>
                        <div className="text-xs text-muted-foreground">@{member.username}</div>
                      </div>
                    </div>
                  ))}
                  {(!team.members || team.members.length === 0) && (
                    <div className="text-sm text-muted-foreground">No members in this team.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
