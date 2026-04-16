import type { Prisma, MemberRole, TaskPriority, UserTheme } from "@prisma/client"

// Aliases de tipos base — now derived from Prisma
export type User = Prisma.UserGetPayload<{}>
export type Workspace = Prisma.WorkspaceGetPayload<{}>
export type WorkspaceMember = Prisma.WorkspaceMemberGetPayload<{}>
export type Project = Prisma.ProjectGetPayload<{}>
export type Column = Prisma.ColumnGetPayload<{}>
export type Task = Prisma.TaskGetPayload<{}>
export type Subtask = Prisma.SubtaskGetPayload<{}>
export type Comment = Prisma.CommentGetPayload<{}>
export type Attachment = Prisma.AttachmentGetPayload<{}>
export type Notification = Prisma.NotificationGetPayload<{}>
export type ActivityLog = Prisma.ActivityLogGetPayload<{}>
export type Invitation = Prisma.InvitationGetPayload<{}>

// Tipos compuestos
export type TaskWithAssignee = Task & {
  assignee: Pick<User, "id" | "name" | "image"> | null
  creator: Pick<User, "id" | "name" | "image">
}

export type TaskDetail = TaskWithAssignee & {
  subtasks: Subtask[]
  comments: (Comment & { author: Pick<User, "id" | "name" | "image"> })[]
  attachments: (Attachment & { uploader: Pick<User, "id" | "name"> })[]
}

export type ColumnWithTasks = Column & {
  tasks: TaskWithAssignee[]
}

export type ProjectWithColumns = Project & {
  columns: ColumnWithTasks[]
}

export type WorkspaceWithMembers = Workspace & {
  members: (WorkspaceMember & { user: Pick<User, "id" | "name" | "email" | "image"> })[]
}

// Roles — re-exported from Prisma enums
export type { MemberRole, TaskPriority, UserTheme }

// IA
export interface AISuggestion {
  type: "stalled" | "due_soon" | "overloaded" | "no_description" | "overdue"
  message: string
  action: { label: string; href: string }
  priority: TaskPriority
  task_id?: string
  created_at: string
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

// API responses
export interface ApiResponse<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: string
  code?: string
}

export interface PaginatedResponse<T> {
  success: true
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

// Planes
export type Plan = "free" | "pro" | "business" | "enterprise"

export const PLAN_LIMITS: Record<Plan, {
  projects: number | null
  members: number | null
  tasks: number | null
  storageMb: number | null
  aiSuggestionsPerDay: number | null
  aiChatPerDay: number | null
}> = {
  free: {
    projects: 1,
    members: 3,
    tasks: 50,
    storageMb: 100,
    aiSuggestionsPerDay: 0,
    aiChatPerDay: 0,
  },
  pro: {
    projects: null,
    members: 10,
    tasks: null,
    storageMb: 5120,
    aiSuggestionsPerDay: 20,
    aiChatPerDay: 10,
  },
  business: {
    projects: null,
    members: null,
    tasks: null,
    storageMb: 51200,
    aiSuggestionsPerDay: null,
    aiChatPerDay: null,
  },
  enterprise: {
    projects: null,
    members: null,
    tasks: null,
    storageMb: null,
    aiSuggestionsPerDay: null,
    aiChatPerDay: null,
  },
}

// Columnas fijas del MVP
export const DEFAULT_COLUMNS = [
  { name: "Sin iniciar", position: 0, color: "#94A3B8" },
  { name: "En progreso", position: 1, color: "#F97316" },
  { name: "Bloqueado", position: 2, color: "#EF4444" },
  { name: "Hecho", position: 3, color: "#22C55E" },
] as const
