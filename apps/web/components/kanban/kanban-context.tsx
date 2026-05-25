"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { type Priority, type Assignee } from "./kanban-card"

export type Task = {
  id: string
  title: string
  description?: string
  priority: Priority
  dateInfo?: { text: string; isToday?: boolean; isOverdue?: boolean }
  dueDate?: string
  assignee?: Assignee
}

export type KanbanMember = Assignee & { email?: string, image?: string | null }


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
  members: KanbanMember[]
  addTask: (columnId: string, task: Task) => void
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void
  moveTask: (activeId: string, overId: string, activeColId: string, overColId: string) => void
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined)

export function KanbanProvider({ 
  children,
  initialColumnsData,
  initialMembers = []
}: { 
  children: ReactNode,
  initialColumnsData?: ColumnData[],
  initialMembers?: KanbanMember[]
}) {
  const [columns, setColumns] = useState<ColumnData[]>(initialColumnsData || initialColumns)
  const [members, setMembers] = useState<KanbanMember[]>(initialMembers)

  useEffect(() => {
    if (initialColumnsData) {
      setColumns(initialColumnsData)
    }
  }, [initialColumnsData])

  useEffect(() => {
    if (initialMembers.length > 0) {
      setMembers(initialMembers)
    }
  }, [initialMembers])

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

  const moveTask = (activeId: string, overId: string, activeColId: string, overColId: string) => {
    setColumns((prevColumns) => {
      const activeColIndex = prevColumns.findIndex((col) => col.id === activeColId)
      const overColIndex = prevColumns.findIndex((col) => col.id === overColId)
      
      if (activeColIndex === -1 || overColIndex === -1) return prevColumns

      const activeCol = prevColumns[activeColIndex]
      const overCol = prevColumns[overColIndex]

      const activeTaskIndex = activeCol.tasks.findIndex((t) => t.id === activeId)
      const overTaskIndex = overId === overColId 
        ? overCol.tasks.length 
        : overCol.tasks.findIndex((t) => t.id === overId)

      if (activeTaskIndex === -1) return prevColumns

      const newColumns = [...prevColumns]
      const task = activeCol.tasks[activeTaskIndex]

      if (activeColId === overColId) {
        // Moving within the same column
        const newTasks = [...activeCol.tasks]
        newTasks.splice(activeTaskIndex, 1)
        newTasks.splice(overTaskIndex, 0, task)
        newColumns[activeColIndex] = { ...activeCol, tasks: newTasks }
      } else {
        // Moving to a different column
        const newActiveTasks = [...activeCol.tasks]
        newActiveTasks.splice(activeTaskIndex, 1)
        
        const newOverTasks = [...overCol.tasks]
        // If dropping on an empty column or at the end
        if (overId === overColId) {
            newOverTasks.push(task)
        } else {
            // Adjust index if we are dropping after the item
            const isBelowOverItem = overTaskIndex >= 0 && activeTaskIndex < overTaskIndex
            const modifier = isBelowOverItem ? 1 : 0
            newOverTasks.splice(overTaskIndex >= 0 ? overTaskIndex + modifier : newOverTasks.length, 0, task)
        }

        newColumns[activeColIndex] = { ...activeCol, tasks: newActiveTasks }
        newColumns[overColIndex] = { ...overCol, tasks: newOverTasks }
      }

      return newColumns
    })
  }

  return (
    <KanbanContext.Provider value={{ columns, members, addTask, updateTask, moveTask }}>
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
