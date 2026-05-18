"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TaskDetailsDialog } from "@/components/task/task-details-dialog"
import type { Task } from "@/components/kanban/kanban-context"

export type Priority = "baja" | "media" | "alta" | "urgente"
export type TaskStatus = "sin_iniciar" | "en_progreso" | "bloqueado" | "hecho"

export interface Assignee {
  id: string
  name: string
  initials: string
  color?: string
}

export interface KanbanCardProps {
  id: string
  title: string
  description?: string
  priority: Priority
  dateInfo?: {
    text: string
    isOverdue?: boolean
    isToday?: boolean
  }
  assignee?: Assignee
  columnId: string
}

export function KanbanCard({ id, title, description, priority, dateInfo, assignee, columnId }: KanbanCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Priority styles
  const priorityStyles = {
    baja: "bg-emerald-50 text-emerald-600",
    media: "bg-yellow-50 text-yellow-600",
    alta: "bg-orange-50 text-orange-600",
    urgente: "bg-red-50 text-red-600 uppercase font-bold",
  }

  // Formatting date
  const renderDate = () => {
    if (!dateInfo) return null

    if (dateInfo.isOverdue) {
      return (
        <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
          {dateInfo.text}
        </span>
      )
    }

    if (dateInfo.isToday) {
      return (
        <span className="text-[10px] font-semibold text-red-500 flex items-center gap-1">
          📅 {dateInfo.text}
        </span>
      )
    }

    return (
      <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
        📅 {dateInfo.text}
      </span>
    )
  }

  // Build the Task object for the dialog
  const taskForDialog: Task = {
    id,
    title,
    description,
    priority,
    dateInfo,
    assignee,
  }

  return (
    <>
      <div
        onClick={() => setIsDialogOpen(true)}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start">
          <span
            className={cn(
              "text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider",
              priorityStyles[priority]
            )}
          >
            {priority.toUpperCase()}
          </span>
          
          {assignee && (
            <Avatar className="w-6 h-6 border-2 border-white shadow-sm -mt-1 -mr-1">
              <AvatarFallback 
                className="text-[9px] font-bold text-white"
                style={{ backgroundColor: assignee.color || "#F97316" }}
              >
                {assignee.initials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <h4 className="text-sm font-bold text-brand-text leading-tight">
          {title}
        </h4>

        {dateInfo && (
          <div className="mt-auto pt-1">
            {renderDate()}
          </div>
        )}
      </div>

      <TaskDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={taskForDialog}
        columnId={columnId}
      />
    </>
  )
}
