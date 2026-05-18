"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { type Priority, type Assignee } from "./kanban-card"

export type Task = {
  id: string
  title: string
  description?: string
  priority: Priority
  dateInfo?: { text: string; isToday?: boolean; isOverdue?: boolean }
  assignee?: Assignee
}

export type ColumnData = {
  id: string
  title: string
  tasks: Task[]
}

export const mockAssignees: Record<string, Assignee> = {
  JR: { id: "1", name: "Jorge Ramírez", initials: "JR", color: "#F97316" }, // Orange
  MC: { id: "2", name: "Maria Castro", initials: "MC", color: "#10B981" }, // Emerald
  AR: { id: "3", name: "Ana Ruiz", initials: "AR", color: "#F59E0B" }, // Amber
}

const initialColumns: ColumnData[] = [
  {
    id: "sin_iniciar",
    title: "SIN INICIAR",
    tasks: [
      {
        id: "task-1",
        title: "Definir arquitectura de datos",
        priority: "media",
        dateInfo: { text: "15 mar" },
        assignee: mockAssignees.JR,
      },
      {
        id: "task-2",
        title: "Escribir microcopy onboarding",
        priority: "baja",
        dateInfo: { text: "20 mar" },
        assignee: mockAssignees.AR,
      },
    ],
  },
  {
    id: "en_progreso",
    title: "EN PROGRESO",
    tasks: [
      {
        id: "task-3",
        title: "Integrar API del Asistente",
        priority: "alta",
        dateInfo: { text: "Hoy 11 mar", isToday: true },
        assignee: mockAssignees.MC,
      },
      {
        id: "task-4",
        title: "Diseñar estados vacíos",
        priority: "media",
        dateInfo: { text: "12 mar" },
        assignee: mockAssignees.AR,
      },
      {
        id: "task-5",
        title: "Optimizar sidebar navegación",
        priority: "alta",
        dateInfo: { text: "Atrasada 9 mar", isOverdue: true },
        assignee: mockAssignees.JR,
      },
    ],
  },
  {
    id: "bloqueado",
    title: "BLOQUEADO",
    tasks: [
      {
        id: "task-6",
        title: "Setup base de datos",
        priority: "urgente",
        dateInfo: { text: "Atrasada 8 mar", isOverdue: true },
        assignee: mockAssignees.JR,
      },
    ],
  },
  {
    id: "hecho",
    title: "HECHO",
    tasks: [],
  },
]

type KanbanContextType = {
  columns: ColumnData[]
  addTask: (columnId: string, task: Task) => void
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined)

export function KanbanProvider({ 
  children,
  initialColumnsData
}: { 
  children: ReactNode,
  initialColumnsData?: ColumnData[]
}) {
  const [columns, setColumns] = useState<ColumnData[]>(initialColumnsData || initialColumns)

  useEffect(() => {
    if (initialColumnsData) {
      setColumns(initialColumnsData)
    }
  }, [initialColumnsData])

  const addTask = (columnId: string, task: Task) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: [task, ...col.tasks],
          }
        }
        return col
      })
    )
  }

  const updateTask = (taskId: string, updatedFields: Partial<Task>) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({
        ...col,
        tasks: col.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updatedFields } : task
        ),
      }))
    )
  }

  return (
    <KanbanContext.Provider value={{ columns, addTask, updateTask }}>
      {children}
    </KanbanContext.Provider>
  )
}

export function useKanbanContext() {
  const context = useContext(KanbanContext)
  if (context === undefined) {
    throw new Error("useKanbanContext must be used within a KanbanProvider")
  }
  return context
}
