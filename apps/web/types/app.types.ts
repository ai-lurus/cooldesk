import type { Database } from "./database.types"

// Aliases de tipos base
export type User = Database["public"]["Tables"]["users"]["Row"]
export type Workspace = Database["public"]["Tables"]["workspaces"]["Row"]
export type WorkspaceMember = Database["public"]["Tables"]["workspace_members"]["Row"]
export type Project = Database["public"]["Tables"]["projects"]["Row"]
export type Column = Database["public"]["Tables"]["columns"]["Row"]
export type Task = Database["public"]["Tables"]["tasks"]["Row"]
export type Subtask = Database["public"]["Tables"]["subtasks"]["Row"]
export type Comment = Database["public"]["Tables"]["comments"]["Row"]
export type Attachment = Database["public"]["Tables"]["attachments"]["Row"]
export type Notification = Database["public"]["Tables"]["notifications"]["Row"]
export type ActivityLog = Database["public"]["Tables"]["activity_log"]["Row"]
export type Invitation = Database["public"]["Tables"]["invitations"]["Row"]

// Tipos compuestos
export type TaskWithAssignee = Task & {
  assignee: Pick<User, "id" | "name" | "avatar_url"> | null
  creator: Pick<User, "id" | "name" | "avatar_url">
}

export type TaskDetail = TaskWithAssignee & {
  subtasks: Subtask[]
  comments: (Comment & { author: Pick<User, "id" | "name" | "avatar_url"> })[]
  attachments: (Attachment & { uploader: Pick<User, "id" | "name"> })[]
}

export type ColumnWithTasks = Column & {
  tasks: TaskWithAssignee[]
}

export type ProjectWithColumns = Project & {
  columns: ColumnWithTasks[]
}

export type WorkspaceWithMembers = Workspace & {
  members: (WorkspaceMember & { user: Pick<User, "id" | "name" | "email" | "avatar_url"> })[]
}

// Roles
export type MemberRole = Database["public"]["Enums"]["member_role"]
export type TaskPriority = Database["public"]["Enums"]["task_priority"]
export type UserTheme = Database["public"]["Enums"]["user_theme"]

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
