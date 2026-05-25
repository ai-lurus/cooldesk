"use client"

import { useState } from "react"
import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"
import { useKanbanContext, Task } from "./kanban-context"
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, closestCorners, useSensor, useSensors, DragOverlay } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

export function KanbanBoard() {
  const { columns, moveTask } = useKanbanContext()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeId = active.id as string

    for (const col of columns) {
      const task = col.tasks.find((t) => t.id === activeId)
      if (task) {
        setActiveTask(task)
        return
      }
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeColId = active.data.current?.sortable?.containerId
    const overColId = over.data.current?.sortable?.containerId || over.id

    if (!activeColId || !overColId) return

    if (activeColId !== overColId) {
      moveTask(activeId, overId, activeColId, overColId)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string
    
    const activeColId = active.data.current?.sortable?.containerId
    const overColId = over.data.current?.sortable?.containerId || over.id

    if (!activeColId || !overColId) return
    if (activeColId !== overColId) return // handled in dragOver

    if (activeId === overId) return

    moveTask(activeId, overId, activeColId, overColId)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full w-full overflow-x-auto pb-4 gap-6 px-1">
        {columns.map((col) => (
          <KanbanColumn key={col.id} id={col.id} title={col.title} count={col.tasks.length}>
            <SortableContext items={col.tasks.map(t => t.id)} strategy={verticalListSortingStrategy} id={col.id}>
              {col.tasks.map((task) => (
                <KanbanCard key={task.id} {...task} columnId={col.id} />
              ))}
            </SortableContext>
          </KanbanColumn>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="rotate-2 opacity-80 cursor-grabbing">
            <KanbanCard {...activeTask} columnId="" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
