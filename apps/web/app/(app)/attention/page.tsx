import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Ban, Clock, Eye } from "lucide-react"

export const metadata = { title: "Atención — SimplyDesk" }

export default async function AttentionPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/login")

  const userId = session.user.id

  const membership = await db.workspaceMember.findFirst({
    where: { userId },
    include: {
      workspace: { select: { id: true } },
    },
  })

  if (!membership) redirect("/onboarding")

  const workspaceId = membership.workspace.id

  // Fetch all tasks in the workspace that are not "HECHO"
  const tasks = await db.task.findMany({
    where: {
      project: { workspaceId },
      column: { name: { not: "HECHO" } }
    },
    include: {
      column: true,
      project: { select: { name: true } },
      assignee: { select: { name: true, image: true, email: true } },
    }
  })

  // Calculate stats
  const now = new Date()
  now.setHours(0,0,0,0) // start of today

  const blockedTasks = tasks.filter(t => t.column?.name === "BLOQUEADO")
  // Only consider late if it's not already blocked
  const lateTasks = tasks.filter(t => t.column?.name !== "BLOQUEADO" && t.dueDate && new Date(t.dueDate) < now)

  let cBlocked = 0;
  let cLate = 0;
  let cUnassigned = 0;
  
  tasks.forEach(t => {
    if (t.column?.name === "BLOQUEADO") {
      cBlocked++;
    } else if (t.dueDate && new Date(t.dueDate) < now) {
      cLate++;
    } else if (!t.assignee) {
      cUnassigned++;
    }
  })

  const totalChart = cBlocked + cLate + cUnassigned;
  const getPercentage = (count: number) => {
    if (totalChart === 0) return 0
    return Math.round((count / totalChart) * 100)
  }

  const pBlocked = getPercentage(cBlocked)
  const pLate = getPercentage(cLate)
  const pUnassigned = getPercentage(cUnassigned)

  // Critical tasks list (blocked or late)
  const criticalTasks = [...blockedTasks, ...lateTasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10) // show top 10

  // The UI requires some dynamic calculation to draw conic gradient correctly
  const p1 = pBlocked;
  const p2 = pBlocked + pLate;

  function getInitials(name: string | null, email: string): string {
    if (name) {
      return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    }
    return email ? email[0].toUpperCase() : "U"
  }

  return (
    <div className="max-w-5xl mx-auto py-8 pt-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#B9551C] leading-none mb-2 tracking-tight">
          Requiere atención
        </h1>
        <p className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">
          {criticalTasks.length} ACCIONES · ACTUALIZADO HOY
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Chart */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100/50">
            <h2 className="text-lg font-bold text-brand-text mb-10">Estado de Tareas</h2>
            
            <div className="relative w-56 h-56 mx-auto flex items-center justify-center mb-10">
              {totalChart > 0 ? (
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#B91C1C ${p1}%, #F97316 ${p1}% ${p2}%, #E5E7EB ${p2}% 100%)`
                  }}
                />
              ) : (
                <div className="absolute inset-0 rounded-full bg-gray-100" />
              )}
              <div className="absolute inset-[22px] bg-white rounded-full flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-brand-text mb-1">{totalChart}</span>
                <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">Total</span>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between bg-gray-50/80 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#B91C1C]" />
                  <span className="text-[13px] font-semibold text-brand-text">Bloqueado</span>
                </div>
                <span className="text-sm font-bold text-brand-text">{pBlocked}%</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50/80 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#F97316]" />
                  <span className="text-[13px] font-semibold text-brand-text">Atrasado</span>
                </div>
                <span className="text-sm font-bold text-brand-text">{pLate}%</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50/80 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
                  <span className="text-[13px] font-semibold text-brand-text">Sin asignar</span>
                </div>
                <span className="text-sm font-bold text-brand-text">{pUnassigned}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Tasks list */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-brand-text px-1">Tareas críticas</h2>
          
          <div className="space-y-4">
            {criticalTasks.length === 0 ? (
              <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100/50 text-center text-gray-500 font-medium">
                No hay tareas críticas en este momento. ¡Buen trabajo!
              </div>
            ) : null}

            {criticalTasks.map((task) => {
              const isBlocked = task.column?.name === "BLOQUEADO"
              const tagColor = isBlocked ? "bg-[#B91C1C]" : "bg-[#F97316]"
              const iconColorBg = isBlocked ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"
              const Icon = isBlocked ? Ban : Clock

              return (
                <div key={task.id} className="bg-white rounded-[20px] p-5 flex items-center gap-4 shadow-sm border border-gray-100/50 transition-shadow hover:shadow-md">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconColorBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-brand-text truncate">{task.title}</h3>
                    <p className="text-xs font-semibold text-gray-400 mt-1">Proyecto: {task.project.name}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {task.assignee && (
                      <div className="flex items-center -space-x-2 mr-2">
                        <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold ring-2 ring-white border border-gray-100 overflow-hidden z-10">
                          {task.assignee.image ? (
                            <img src={task.assignee.image} alt={task.assignee.name || ""} className="w-full h-full object-cover" />
                          ) : (
                            getInitials(task.assignee.name, task.assignee.email || "")
                          )}
                        </div>
                      </div>
                    )}

                    <div className={`px-3 py-1.5 rounded-full ${tagColor} text-white text-[10px] font-black uppercase tracking-wider min-w-[90px] text-center`}>
                      {isBlocked ? "BLOQUEADO" : "ATRASADO"}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button className="w-full mt-2 bg-gray-50/80 hover:bg-gray-100 transition-colors py-4 rounded-[20px] flex items-center justify-center gap-2 text-sm font-bold text-[#F97316]">
            <Eye className="w-4 h-4" />
            Ver todas las tareas críticas
          </button>
        </div>
      </div>
    </div>
  )
}
