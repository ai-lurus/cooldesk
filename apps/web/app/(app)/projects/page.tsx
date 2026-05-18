import { KanbanBoard } from "@/components/kanban/kanban-board"
import { ProjectSelector } from "./project-selector"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { headers, cookies } from "next/headers"

export default async function ProjectsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return null
  }

  const memberships = await db.workspaceMember.findMany({
    where: { userId: session.user.id },
    include: {
      workspace: { select: { id: true } },
    },
    orderBy: { invitedAt: "asc" },
    take: 1,
  })

  const workspace = memberships[0]?.workspace

  let projects: { id: string; name: string }[] = []
  if (workspace) {
    projects = await db.project.findMany({
      where: { workspaceId: workspace.id },
      select: { id: true, name: true },
      orderBy: { createdAt: "asc" },
    })
  }

  const cookieStore = await cookies()
  const activeProjectId = cookieStore.get("active_project_id")?.value
  
  let targetProjectId = activeProjectId
  if (!targetProjectId || !projects.find(p => p.id === targetProjectId)) {
    targetProjectId = projects[0]?.id || ""
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="px-8 pt-6 pb-4 lg:px-12 shrink-0">
          <p className="text-brand-primary font-bold text-xs tracking-widest mb-0.5">
            PROYECTOS
          </p>
          <ProjectSelector projects={projects} activeProjectId={targetProjectId} />
        </div>

        {/* Kanban Board Area */}
        <div className="flex-1 min-h-0 overflow-hidden px-8 pb-6">
          <KanbanBoard />
        </div>
      </main>
    </div>
  )
}
