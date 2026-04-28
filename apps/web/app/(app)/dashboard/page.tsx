import { redirect } from "next/navigation"
import { headers } from "next/headers"
import Image from "next/image"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { PlusCircle, MoreHorizontal } from "lucide-react"
import { AiAssistantDrawer } from "@/components/ai-assistant-drawer"

export const metadata = { title: "Dashboard — SimplyDesk" }

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/login")

  const userId = session.user.id

  const profile = await db.user.findUnique({
    where: { id: userId },
    select: { name: true },
  })

  const membership = await db.workspaceMember.findFirst({
    where: { userId },
    include: {
      workspace: { select: { id: true, name: true } },
    },
  })

  const workspace = membership?.workspace
  if (!workspace) redirect("/onboarding")

  // Task counts — Tasks don't have a status field, they use columns.
  // For the dashboard summary we just show total assigned tasks as "pendientes"
  // and completed can be derived later. For now, show simple counts.
  const totalTasks = await db.task.count({
    where: { assignedTo: userId },
  })

  // For a clean dashboard experience, default all to 0
  const pendingCount = totalTasks
  const inProgressCount = 0
  const completedCount = 0

  const firstName = profile?.name?.split(" ")[0] ?? ""

  return (
    <div className="h-full flex flex-col items-center justify-center relative py-6">
      {/* AI assistant floating drawer */}
      <AiAssistantDrawer />

      {/* Main content card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row relative">

        {/* Left side — Banner image */}
        <div className="lg:w-[45%] relative min-h-[260px] lg:min-h-0">
          <Image
            src="/dashboard-banner.png"
            alt="Dashboard Banner"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
            priority
          />
          {/* Subtle gradient overlay on right edge */}
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent hidden lg:block" />
          {/* Subtle gradient overlay on bottom edge (mobile) */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent lg:hidden" />
        </div>

        {/* Right side — Content */}
        <div className="lg:w-[55%] flex flex-col justify-center px-8 py-10 lg:px-12 lg:py-14">
          {/* Greeting */}
          <p className="text-brand-primary font-bold text-lg mb-1">
            Hola, {firstName || "Usuario"}!
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-text leading-tight mb-4">
            Tu tablero está listo para la acción.
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md">
            Organiza, prioriza y ejecuta. Comienza tu primer proyecto hoy mismo
            y transforma tus ideas en realidades estructuradas.
          </p>

          {/* CTA */}
          <button className="self-start bg-brand-primary hover:bg-brand-primary-hover text-white flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all shadow-md shadow-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/30 mb-10">
            <PlusCircle className="w-5 h-5" />
            Añadir tarea
          </button>

          {/* Stat cards */}
          <div className="flex gap-3">
            <StatCard value={pendingCount} label="PENDIENTES" />
            <StatCard value={inProgressCount} label="EN CURSO" />
            <StatCard value={completedCount} label="COMPLETADAS" />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex-1 border border-gray-200 rounded-xl p-4 min-w-[100px]">
      <p className="text-2xl font-bold text-brand-text mb-0.5">{value}</p>
      <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
        {label}
      </p>
    </div>
  )
}
