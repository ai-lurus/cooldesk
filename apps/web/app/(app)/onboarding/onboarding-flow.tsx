"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Building2, Users, FolderKanban, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createWorkspace, inviteMembers, createFirstProject } from "./actions"

type Step = "workspace" | "invite" | "project" | "done"

const STEPS: { id: Step; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "invite", label: "Equipo", icon: Users },
  { id: "project", label: "Proyecto", icon: FolderKanban },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50)
}

export function OnboardingFlow() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState<Step>("workspace")
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)

  // Step 1 state
  const [wsName, setWsName] = useState("")
  const [wsSlug, setWsSlug] = useState("")

  // Step 2 state
  const [emails, setEmails] = useState("")

  // Step 3 state
  const [projectName, setProjectName] = useState("")

  const currentStepIndex = STEPS.findIndex((s) => s.id === step)

  function handleWsNameChange(value: string) {
    setWsName(value)
    setWsSlug(slugify(value))
  }

  function handleCreateWorkspace() {
    const data = new FormData()
    data.set("name", wsName)
    data.set("slug", wsSlug)

    startTransition(async () => {
      const result = await createWorkspace(data)
      if ("error" in result) {
        toast.error(result.error)
        return
      }
      setWorkspaceId(result.workspaceId)
      setStep("invite")
    })
  }

  function handleInvite(skip = false) {
    if (skip || !emails.trim()) {
      setStep("project")
      return
    }

    const data = new FormData()
    data.set("emails", emails)
    data.set("workspaceId", workspaceId!)
    data.set("role", "member")

    startTransition(async () => {
      const result = await inviteMembers(data)
      if ("error" in result) {
        toast.error(result.error)
        return
      }
      toast.success(`${result.invited} invitación(es) enviada(s)`)
      setStep("project")
    })
  }

  function handleCreateProject(skip = false) {
    if (skip) {
      router.push("/dashboard")
      return
    }

    const data = new FormData()
    data.set("name", projectName)
    data.set("workspaceId", workspaceId!)

    startTransition(async () => {
      const result = await createFirstProject(data)
      if ("error" in result) {
        toast.error(result.error)
        return
      }
      setProjectId(result.projectId)
      setStep("done")
    })
  }

  if (step === "done") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-green-500" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-[#1C1917] mb-2">
          ¡Todo listo!
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Tu workspace está configurado. Empecemos a trabajar.
        </p>
        <Button
          onClick={() =>
            router.push(projectId ? `/projects/${projectId}` : "/dashboard")
          }
          className="w-full bg-[#F97316] hover:bg-[#ea6c0a] text-white"
        >
          Ir a mi proyecto
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Step indicator */}
      <div className="flex border-b border-gray-100">
        {STEPS.map((s, i) => {
          const isCompleted = i < currentStepIndex
          const isActive = s.id === step
          const Icon = s.icon

          return (
            <div
              key={s.id}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${
                isActive
                  ? "text-[#F97316] border-b-2 border-[#F97316]"
                  : isCompleted
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              <span className="hidden sm:block">{s.label}</span>
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="p-8">
        {step === "workspace" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-[#1C1917] mb-1">
                Crea tu workspace
              </h2>
              <p className="text-sm text-gray-500">
                Un workspace agrupa todos tus proyectos y equipo.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="wsName">Nombre del workspace</Label>
                <Input
                  id="wsName"
                  placeholder="Mi empresa"
                  value={wsName}
                  onChange={(e) => handleWsNameChange(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wsSlug">
                  URL{" "}
                  <span className="text-xs text-gray-400 font-normal">
                    (se genera automáticamente)
                  </span>
                </Label>
                <div className="flex items-center gap-0 border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#F97316] focus-within:border-[#F97316]">
                  <span className="bg-gray-50 px-3 py-2 text-xs text-gray-400 border-r whitespace-nowrap">
                    cooldesk.app/
                  </span>
                  <input
                    id="wsSlug"
                    className="flex-1 px-3 py-2 text-sm outline-none bg-white"
                    placeholder="mi-empresa"
                    value={wsSlug}
                    onChange={(e) => setWsSlug(slugify(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleCreateWorkspace}
              disabled={isPending || !wsName.trim() || !wsSlug.trim()}
              className="w-full bg-[#F97316] hover:bg-[#ea6c0a] text-white"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Continuar
            </Button>
          </div>
        )}

        {step === "invite" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-[#1C1917] mb-1">
                Invita a tu equipo
              </h2>
              <p className="text-sm text-gray-500">
                Puedes invitar más personas después desde configuración.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emails">
                Emails{" "}
                <span className="text-xs text-gray-400 font-normal">
                  (separados por coma o nueva línea)
                </span>
              </Label>
              <textarea
                id="emails"
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] resize-none min-h-[100px]"
                placeholder={"ana@empresa.com\nbeto@empresa.com"}
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleInvite(true)}
                className="flex-1"
                disabled={isPending}
              >
                Omitir por ahora
              </Button>
              <Button
                onClick={() => handleInvite(false)}
                disabled={isPending || !emails.trim()}
                className="flex-1 bg-[#F97316] hover:bg-[#ea6c0a] text-white"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Enviar invitaciones
              </Button>
            </div>
          </div>
        )}

        {step === "project" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-[#1C1917] mb-1">
                Crea tu primer proyecto
              </h2>
              <p className="text-sm text-gray-500">
                Organiza el trabajo en tableros kanban con 4 columnas fijas.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="projectName">Nombre del proyecto</Label>
              <Input
                id="projectName"
                placeholder="Desarrollo web, Marketing Q1…"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="rounded-lg bg-gray-50 p-3 flex gap-2 flex-wrap">
              {[
                { name: "Sin iniciar", color: "#94A3B8" },
                { name: "En progreso", color: "#F97316" },
                { name: "Bloqueado", color: "#EF4444" },
                { name: "Hecho", color: "#22C55E" },
              ].map((col) => (
                <span
                  key={col.name}
                  className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                  style={{ backgroundColor: col.color }}
                >
                  {col.name}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleCreateProject(true)}
                className="flex-1"
                disabled={isPending}
              >
                Omitir por ahora
              </Button>
              <Button
                onClick={() => handleCreateProject(false)}
                disabled={isPending || !projectName.trim()}
                className="flex-1 bg-[#F97316] hover:bg-[#ea6c0a] text-white"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Crear proyecto
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
