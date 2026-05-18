"use client"

import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"
import { useKanbanContext } from "./kanban-context"

export function KanbanBoard() {
  const { columns } = useKanbanContext()

  return (
    <div className="flex h-full w-full overflow-x-auto pb-4 gap-6 px-1">
      {columns.map((col) => (
        <KanbanColumn key={col.id} id={col.id} title={col.title} count={col.tasks.length}>
          {col.tasks.map((task) => (
            <KanbanCard key={task.id} {...task} />
          ))}
        </KanbanColumn>
      ))}
    </div>
  )
}
