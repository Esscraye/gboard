"use client"

import { useMutation, useQuery } from "@apollo/client/react"
import { motion } from "framer-motion"
import { Plus, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { CREATE_TEAM_MUTATION } from "@/lib/graphql/mutations"
import { GET_TEAMS_QUERY } from "@/lib/graphql/queries"
import type { Team } from "@/types"

export default function TeamsPage() {
  const { data, loading } = useQuery<{ teams: Team[] }>(GET_TEAMS_QUERY)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const router = useRouter()

  if (loading) {
    return (
      <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  const teams = data?.teams || []

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
              <p className="text-muted-foreground">
                Manage your teams and collaborate with others.
              </p>
            </div>
            <CreateTeamDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
          </div>
        </motion.div>

        {teams.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/30"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No teams found</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-sm">
              You haven't joined any teams yet. Create one to get started!
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>Create Team</Button>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {teams.map((team, index) => (
              <TeamCard key={team.id} team={team} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TeamCard({ team, index }: { team: Team; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/teams/${team.id}`}>
        <Card className="h-full flex flex-col hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="truncate flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {team.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 min-h-[40px]">
              {team.description || "No description provided."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{team.members?.length || 0} members</span>
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t bg-muted/20 text-sm text-muted-foreground">
            View Team Details
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}

function CreateTeamDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const router = useRouter()

  const [createTeam, { loading }] = useMutation<{ createTeam: Team }>(CREATE_TEAM_MUTATION, {
    refetchQueries: [{ query: GET_TEAMS_QUERY }],
    onCompleted: (data) => {
      onOpenChange(false)
      setName("")
      setDescription("")
      if (data?.createTeam?.id) {
        router.push(`/teams/${data.createTeam.id}`)
      }
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    await createTeam({
      variables: {
        input: {
          name,
          description,
        },
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>Create a new team to collaborate on projects.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                placeholder="e.g. Engineering, Marketing"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What is this team for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading && <Plus className="mr-2 h-4 w-4 animate-spin" />}
              Create Team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
