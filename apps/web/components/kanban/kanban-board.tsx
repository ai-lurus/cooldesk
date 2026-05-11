"use client"

import { KanbanColumn } from "./kanban-column"
import { KanbanCard, type Priority, type Assignee } from "./kanban-card"

// Mock Data to match the design
const mockAssignees: Record<string, Assignee> = {
  JR: { id: "1", name: "Jorge Ramírez", initials: "JR", color: "#F97316" }, // Orange
  MC: { id: "2", name: "Maria Castro", initials: "MC", color: "#10B981" }, // Emerald
  AR: { id: "3", name: "Ana Ruiz", initials: "AR", color: "#F59E0B" }, // Amber
}

const mockColumns = [
  {
    id: "sin_iniciar",
    title: "SIN INICIAR",
    tasks: [
      {
        id: "task-1",
        title: "Definir arquitectura de datos",
        priority: "media" as Priority,
        dateInfo: { text: "15 mar" },
        assignee: mockAssignees.JR,
      },
      {
        id: "task-2",
        title: "Escribir microcopy onboarding",
        priority: "baja" as Priority,
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
        priority: "alta" as Priority,
        dateInfo: { text: "Hoy 11 mar", isToday: true },
        assignee: mockAssignees.MC,
      },
      {
        id: "task-4",
        title: "Diseñar estados vacíos",
        priority: "media" as Priority,
        dateInfo: { text: "12 mar" },
        assignee: mockAssignees.AR,
      },
      {
        id: "task-5",
        title: "Optimizar sidebar navegación",
        priority: "alta" as Priority,
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
        priority: "urgente" as Priority,
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

export function KanbanBoard() {
  return (
    <div className="flex h-full w-full overflow-x-auto pb-4 gap-6 px-1">
      {mockColumns.map((col) => (
        <KanbanColumn key={col.id} id={col.id} title={col.title} count={col.tasks.length}>
          {col.tasks.map((task) => (
            <KanbanCard key={task.id} {...task} />
          ))}
        </KanbanColumn>
      ))}
    </div>
  )
}
