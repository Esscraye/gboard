"use client"

import { useMutation } from "@apollo/client/react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, MessageSquare, MoreHorizontal, Send, Trash2 } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { CREATE_COMMENT_MUTATION, DELETE_COMMENT_MUTATION } from "@/lib/graphql/mutations"
import { GET_ISSUE_QUERY } from "@/lib/graphql/queries"
import type { Comment } from "@/types"

type CommentsSectionProps = {
  issueId: string
  comments: Comment[]
}

export function CommentsSection({ issueId, comments }: CommentsSectionProps) {
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const [createComment, { loading: creating }] = useMutation(CREATE_COMMENT_MUTATION, {
    refetchQueries: [{ query: GET_ISSUE_QUERY, variables: { id: issueId } }],
    onCompleted: () => setContent(""),
  })

  const [deleteComment, { loading: deleting }] = useMutation(DELETE_COMMENT_MUTATION, {
    refetchQueries: [{ query: GET_ISSUE_QUERY, variables: { id: issueId } }],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    await createComment({
      variables: {
        input: {
          content: content.trim(),
          issueId,
        },
      },
    })
  }

  const handleDelete = async (commentId: string) => {
    await deleteComment({ variables: { id: commentId } })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">Comments</h3>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {comments.length}
        </span>
      </div>

      {/* Comment list */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {comments.map((comment, index) => {
            const authorInitials = comment.author?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)

            const isAuthor = comment.authorId === user?.id

            return (
              <motion.div
                key={comment.id}
                className="flex gap-3 group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Avatar className="h-9 w-9 shrink-0 ring-2 ring-background">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10 font-medium">
                    {authorInitials || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-muted/40 rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{comment.author?.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      {isAuthor && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={deleting}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive cursor-pointer"
                              onClick={() => handleDelete(comment.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {comments.length === 0 && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No comments yet</p>
            <p className="text-xs text-muted-foreground mt-1">Be the first to comment</p>
          </motion.div>
        )}
      </div>

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div
          className={`relative transition-all duration-200 ${isFocused ? "ring-2 ring-primary/20 rounded-xl" : ""}`}
        >
          <Textarea
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={2}
            disabled={creating}
            className="resize-none bg-muted/30 border-border/50 pr-12 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <motion.div
            className="absolute right-2 bottom-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 rounded-lg bg-primary/90 hover:bg-primary shadow-sm"
              disabled={creating || !content.trim()}
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </motion.div>
        </div>
      </form>
    </div>
  )
}
