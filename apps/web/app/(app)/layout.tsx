import { redirect } from "next/navigation"
import { headers, cookies } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { KanbanProvider } from "@/components/kanban/kanban-context"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const user = session.user

  // Fetch user profile
  const profile = await db.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, image: true },
  })

  // Fetch user workspaces
  const memberships = await db.workspaceMember.findMany({
    where: { userId: user.id },
    include: {
      workspace: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { invitedAt: "asc" },
    take: 10,
  })

  const workspaces = memberships.map((m) => m.workspace)

  const headersList = await headers()
  const pathname = headersList.get("x-pathname") ?? ""

  const workspace = workspaces[0] as { id: string; name: string; slug: string } | undefined

  // Fetch projects for the current workspace
  const projects = workspace
    ? await db.project.findMany({
        where: { workspaceId: workspace.id },
        select: { id: true, name: true },
        orderBy: { createdAt: "asc" },
      })
    : []

  if (!workspace || projects.length === 0) {
    redirect("/onboarding")
  }

  const cookieStore = await cookies()
  const activeProjectId = cookieStore.get("active_project_id")?.value
  
  let targetProjectId = activeProjectId
  if (!targetProjectId || !projects.find(p => p.id === targetProjectId)) {
    targetProjectId = projects[0].id
  }

  let initialColumnsData = undefined
  let activeProjectName = projects.find(p => p.id === targetProjectId)?.name || ""

  if (workspace && projects.length > 0) {
    let firstProject = await db.project.findFirst({
      where: { id: targetProjectId, workspaceId: workspace.id },
      include: {
        columns: {
          orderBy: { position: "asc" },
          include: {
            tasks: {
              orderBy: { position: "asc" },
              include: {
                assignee: {
                  select: { id: true, name: true }
                }
              }
            }
          }
        }
      }
    })

    if (firstProject && firstProject.columns.length === 0) {
      // Auto-seed default columns if they don't exist
      await db.column.createMany({
        data: [
          { projectId: firstProject.id, name: "SIN INICIAR", position: 0 },
          { projectId: firstProject.id, name: "EN PROGRESO", position: 1 },
          { projectId: firstProject.id, name: "BLOQUEADO", position: 2 },
          { projectId: firstProject.id, name: "HECHO", position: 3 },
        ]
      })

      // Refetch after seeding
      firstProject = await db.project.findFirst({
        where: { id: firstProject.id },
        include: {
          columns: {
            orderBy: { position: "asc" },
            include: {
              tasks: {
                orderBy: { position: "asc" },
                include: {
                  assignee: {
                    select: { id: true, name: true }
                  }
                }
              }
            }
          }
        }
      })
    }

    if (firstProject) {
      const priorityMap: Record<string, "urgente" | "alta" | "media" | "baja"> = {
        urgent: "urgente",
        high: "alta",
        medium: "media",
        low: "baja",
      }

      initialColumnsData = firstProject.columns.map((col) => ({
        id: col.id,
        title: col.name.toUpperCase(),
        tasks: col.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          priority: priorityMap[task.priority] || "media",
          dateInfo: task.dueDate
            ? {
                text: new Date(task.dueDate).toLocaleDateString("es-MX", { day: "numeric", month: "short" }),
                isOverdue: new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0)),
                isToday: new Date(task.dueDate).toDateString() === new Date().toDateString(),
              }
            : undefined,
          assignee: task.assignee
            ? {
                id: task.assignee.id,
                name: task.assignee.name,
                initials: task.assignee.name.substring(0, 2).toUpperCase(),
                color: "#F97316", // Default color as user doesn't have a color field in DB yet
              }
            : undefined,
        })),
      }))
    }
  }

  const userDisplay = {
    name: profile?.name ?? null,
    email: profile?.email ?? user.email ?? "",
    avatar_url: profile?.image ?? null,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-brand-background">
      {workspace ? (
        <Sidebar
          workspace={workspace}
          projects={projects}
          currentPath={pathname}
          user={userDisplay}
        />
      ) : null}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <KanbanProvider initialColumnsData={initialColumnsData}>
          <Header />
          <main className="flex-1 overflow-y-auto px-6 pb-6">{children}</main>
        </KanbanProvider>
      </div>
    </div>
  )
}
