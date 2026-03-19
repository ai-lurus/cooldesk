// Este archivo es generado automáticamente por Supabase.
// NO editar manualmente.
// Para regenerar: npx supabase gen types typescript --local > types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          role: string
          language: string
          timezone: string
          theme: "light" | "dark" | "system"
          two_factor_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar_url?: string | null
          role?: string
          language?: string
          timezone?: string
          theme?: "light" | "dark" | "system"
          two_factor_enabled?: boolean
        }
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>
        Relationships: []
      }
      workspaces: {
        Row: {
          id: string
          name: string
          slug: string
          owner_id: string
          created_at: string
        }
        Insert: {
          name: string
          slug: string
          owner_id: string
        }
        Update: Partial<Database["public"]["Tables"]["workspaces"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "workspaces_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          workspace_id: string
          user_id: string
          role: "owner" | "admin" | "editor" | "viewer"
          invited_at: string
          joined_at: string | null
        }
        Insert: {
          workspace_id: string
          user_id: string
          role: "owner" | "admin" | "editor" | "viewer"
          invited_at?: string
          joined_at?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["workspace_members"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          color: string
          is_archived: boolean
          created_by: string
          created_at: string
        }
        Insert: {
          workspace_id: string
          name: string
          description?: string | null
          color?: string
          created_by: string
        }
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "projects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      columns: {
        Row: {
          id: string
          project_id: string
          name: string
          position: number
          color: string | null
          created_at: string
        }
        Insert: {
          project_id: string
          name: string
          position: number
          color?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["columns"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "columns_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          column_id: string | null
          title: string
          description: string | null
          priority: "urgent" | "high" | "medium" | "low"
          assigned_to: string | null
          created_by: string
          due_date: string | null
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          project_id: string
          column_id?: string | null
          title: string
          description?: string | null
          priority?: "urgent" | "high" | "medium" | "low"
          assigned_to?: string | null
          created_by: string
          due_date?: string | null
          position?: number
        }
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "columns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subtasks: {
        Row: {
          id: string
          task_id: string
          title: string
          is_completed: boolean
          position: number
        }
        Insert: {
          task_id: string
          title: string
          is_completed?: boolean
          position?: number
        }
        Update: Partial<Database["public"]["Tables"]["subtasks"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "subtasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          task_id: string
          user_id: string
          content: string
        }
        Update: Partial<Database["public"]["Tables"]["comments"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          file_name: string
          file_url: string
          file_size: number
          file_type: string
          created_at: string
        }
        Insert: {
          task_id: string
          user_id: string
          file_name: string
          file_url: string
          file_size: number
          file_type: string
        }
        Update: Partial<Database["public"]["Tables"]["attachments"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_log: {
        Row: {
          id: string
          workspace_id: string
          project_id: string | null
          task_id: string | null
          user_id: string
          action: string
          metadata: Json
          created_at: string
        }
        Insert: {
          workspace_id: string
          project_id?: string | null
          task_id?: string | null
          user_id: string
          action: string
          metadata?: Json
        }
        Update: never
        Relationships: [
          {
            foreignKeyName: "activity_log_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string
          reference_id: string | null
          reference_type: "task" | "project" | "comment" | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          type: string
          title: string
          body: string
          reference_id?: string | null
          reference_type?: "task" | "project" | "comment" | null
        }
        Update: Partial<Pick<Database["public"]["Tables"]["notifications"]["Row"], "is_read">>
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          id: string
          workspace_id: string
          email: string
          role: "admin" | "editor" | "viewer"
          invited_by: string
          token: string
          expires_at: string
          accepted_at: string | null
        }
        Insert: {
          workspace_id: string
          email: string
          role: "admin" | "editor" | "viewer"
          invited_by: string
          token?: string
          expires_at?: string
        }
        Update: Partial<Pick<Database["public"]["Tables"]["invitations"]["Row"], "accepted_at">>
        Relationships: [
          {
            foreignKeyName: "invitations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          workspace_id: string
          messages: Json
          created_at: string
        }
        Insert: {
          user_id: string
          workspace_id: string
          messages?: Json
        }
        Update: Partial<Pick<Database["public"]["Tables"]["ai_conversations"]["Row"], "messages">>
        Relationships: [
          {
            foreignKeyName: "ai_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          user_id: string
          type: string
          email_enabled: boolean
          push_enabled: boolean
          inapp_enabled: boolean
        }
        Insert: {
          user_id: string
          type: string
          email_enabled?: boolean
          push_enabled?: boolean
          inapp_enabled?: boolean
        }
        Update: Partial<Database["public"]["Tables"]["notification_preferences"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      member_role: "owner" | "admin" | "editor" | "viewer"
      invitation_role: "admin" | "editor" | "viewer"
      task_priority: "urgent" | "high" | "medium" | "low"
      user_theme: "light" | "dark" | "system"
    }
  }
}
