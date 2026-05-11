import { KanbanBoard } from "@/components/kanban/kanban-board"

export default function ProjectsPage() {
  return (
    <div className="flex flex-col h-full bg-white">
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="px-8 pt-6 pb-4 lg:px-12 shrink-0">
          <p className="text-brand-primary font-bold text-xs tracking-widest mb-0.5">
            PROYECTOS
          </p>
          <h2 className="text-2xl font-extrabold text-brand-text leading-tight">
            Rediseño app
          </h2>
        </div>

        {/* Kanban Board Area */}
        <div className="flex-1 min-h-0 overflow-hidden px-8 pb-6">
          <KanbanBoard />
        </div>
      </main>
    </div>
  )
}
