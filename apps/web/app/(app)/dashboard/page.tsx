import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import { FolderKanban, Plus, Clock, AlertCircle } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export const metadata = { title: "Inicio — CoolDesk" }

export default async function DashboardPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("name")
    .eq("id", user.id)
    .single()

  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id, workspaces(id, name)")
    .eq("user_id", user.id)
    .limit(1)
    .single()

  const workspace = Array.isArray(memberships?.workspaces)
    ? memberships.workspaces[0]
    : memberships?.workspaces

  if (!workspace) redirect("/onboarding")

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, description, created_at")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false })
    .limit(6)

  // Assigned tasks due today or overdue
  const today = new Date().toISOString().split("T")[0]
  const { data: urgentTasks } = await supabase
    .from("tasks")
    .select("id, title, due_date, priority, projects(name)")
    .eq("assigned_to", user.id)
    .lte("due_date", today)
    .order("due_date", { ascending: true })
    .limit(5)

  const greeting = getGreeting(profile?.name)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1C1917]">{greeting}</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          label="Proyectos"
          value={projects?.length ?? 0}
          icon={<FolderKanban className="w-5 h-5 text-[#F97316]" />}
        />
        <StatCard
          label="Tareas vencidas"
          value={urgentTasks?.length ?? 0}
          icon={<AlertCircle className="w-5 h-5 text-red-500" />}
          alert={!!urgentTasks?.length}
        />
        <StatCard
          label="Vencen hoy"
          value={urgentTasks?.filter((t) => t.due_date === today).length ?? 0}
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
      </div>

      {/* Projects */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#1C1917]">Proyectos</h2>
          <Link
            href="/projects/new"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-[#F97316] hover:bg-[#ea6c0a] text-white"
            )}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Nuevo proyecto
          </Link>
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center shrink-0">
                      <FolderKanban className="w-4 h-4 text-[#F97316]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1C1917] truncate">
                        {project.name}
                      </p>
                      {project.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <FolderKanban className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-4">
              Aún no tienes proyectos. ¡Crea el primero!
            </p>
            <Link
              href="/projects/new"
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-[#F97316] hover:bg-[#ea6c0a] text-white"
              )}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Crear proyecto
            </Link>
          </Card>
        )}
      </section>

      {/* Urgent tasks */}
      {urgentTasks && urgentTasks.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-[#1C1917] mb-3">
            Requieren atención
          </h2>
          <div className="space-y-2">
            {urgentTasks.map((task) => {
              const isOverdue = (task.due_date ?? "") < today
              const projectName = Array.isArray(task.projects)
                ? task.projects[0]?.name
                : (task.projects as { name: string } | null)?.name

              return (
                <Card key={task.id} className="p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C1917] truncate">
                      {task.title}
                    </p>
                    {projectName && (
                      <p className="text-xs text-gray-500">{projectName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={
                        isOverdue
                          ? "text-red-600 border-red-200 bg-red-50"
                          : "text-amber-600 border-amber-200 bg-amber-50"
                      }
                    >
                      {isOverdue
                        ? "Vencida"
                        : "Hoy"}
                    </Badge>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  alert,
}: {
  label: string
  value: number
  icon: React.ReactNode
  alert?: boolean
}) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className={`text-xl font-bold ${alert && value > 0 ? "text-red-600" : "text-[#1C1917]"}`}>
          {value}
        </p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </Card>
  )
}

function getGreeting(name: string | null | undefined): string {
  const hour = new Date().getHours()
  const first = name?.split(" ")[0] ?? ""
  const saludo =
    hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches"
  return first ? `${saludo}, ${first}` : saludo
}
