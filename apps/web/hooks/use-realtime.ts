"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Task, Comment, Notification } from "@/types/app.types"

interface UseRealtimeBoardOptions {
  projectId: string
  onTaskInsert?: (task: Task) => void
  onTaskUpdate?: (task: Task) => void
  onTaskDelete?: (taskId: string) => void
}

export function useRealtimeBoard({
  projectId,
  onTaskInsert,
  onTaskUpdate,
  onTaskDelete,
}: UseRealtimeBoardOptions) {
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`project:${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tasks",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => onTaskInsert?.(payload.new as Task)
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tasks",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => onTaskUpdate?.(payload.new as Task)
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "tasks",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => onTaskDelete?.(payload.old.id as string)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, onTaskInsert, onTaskUpdate, onTaskDelete])
}

interface UseRealtimeTaskOptions {
  taskId: string
  onCommentInsert?: (comment: Comment) => void
}

export function useRealtimeTask({
  taskId,
  onCommentInsert,
}: UseRealtimeTaskOptions) {
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`task:${taskId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `task_id=eq.${taskId}`,
        },
        (payload) => onCommentInsert?.(payload.new as Comment)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [taskId, onCommentInsert])
}

interface UseRealtimeNotificationsOptions {
  userId: string
  onNotification?: (notification: Notification) => void
}

export function useRealtimeNotifications({
  userId,
  onNotification,
}: UseRealtimeNotificationsOptions) {
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`user:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => onNotification?.(payload.new as Notification)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, onNotification])
}
