"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Building2, Users, FolderKanban, CheckCircle2, ArrowRight, ArrowLeft, Plus, UserPlus, Key, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createWorkspace, inviteMembers, createFirstProject } from "./actions"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthSideContent } from "@/components/auth/auth-side-content"
import Image from "next/image"

type Step = "workspace" | "invite" | "project" | "done"

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
  const [workspaceOption, setWorkspaceOption] = useState<"create" | "join">("create")
  const [wsName, setWsName] = useState("")
  const [wsSlug, setWsSlug] = useState("")
  const [joinCode, setJoinCode] = useState("")

  // Step 2 state
  const [invites, setInvites] = useState([{ email: "", role: "editor" }, { email: "", role: "viewer" }])

  // Step 3 state
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectColor, setProjectColor] = useState("#F97316")

  function handleWsNameChange(value: string) {
    setWsName(value)
    setWsSlug(slugify(value))
  }

  function handleJoinWorkspace() {
    // To be implemented in backend
    toast.info("Funcionalidad de unirse con código próximamente")
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
    const validEmails = invites.filter((i) => i.email.trim() !== "").map((i) => i.email.trim())

    if (skip || validEmails.length === 0) {
      setStep("project")
      return
    }

    const data = new FormData()
    data.set("emails", validEmails.join(","))
    data.set("workspaceId", workspaceId!)
    data.set("role", "member") // the backend currently only accepts one role for all in the simple form, but we can update it later.

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
    // We can handle description/color in the future via API extension

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
      <AuthLayout centered logoPosition="left">
        <div className="text-center p-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-brand-text mb-3 tracking-tight">
            ¡Todo listo!
          </h2>
          <p className="text-brand-text-muted font-medium mb-8">
            Tu workspace está configurado. Empecemos a trabajar.
          </p>
          <Button
            onClick={() =>
              router.push(projectId ? `/projects/${projectId}` : "/dashboard")
            }
            className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl h-12 font-bold"
          >
            Ir a mi proyecto
          </Button>
        </div>
      </AuthLayout>
    )
  }

  if (step === "workspace") {
    return (
      <AuthLayout 
        singleCard 
        logoPosition="left"
        sideContent={
          <div className="w-full h-full relative">
             <Image 
               src="/onboarding1.png" 
               alt="Onboarding" 
               fill 
               className="object-cover"
               priority
             />
             <div className="absolute inset-0 bg-black/5"></div>
             
             {/* Floating Info Card */}
             <div className="absolute top-[45%] left-10 max-w-[260px] bg-white/80 backdrop-blur-md px-6 py-5 rounded-2xl shadow-2xl border border-white/20">
               <div className="flex items-center gap-2 mb-3">
                 <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                 <span className="text-[10px] font-bold text-brand-text/60 tracking-widest uppercase">Intelligent Space</span>
               </div>
               <p className="text-brand-text text-base font-bold leading-tight">
                 Organiza tus ideas con el poder de la IA en un lienzo infinito.
               </p>
             </div>
          </div>
        }
      >
        <div className="flex flex-col h-full w-full justify-between pt-4">
          <div>
            <div className="mb-8">
              <div className="font-bold text-[10px] tracking-widest uppercase text-brand-text mb-4">
                COGNITIVECANVAS
              </div>
              <h1 className="text-[32px] sm:text-[40px] leading-[1.1] font-extrabold text-brand-text mb-3 tracking-tight">
                Configura tu espacio<br/>de trabajo
              </h1>
              <p className="text-[15px] text-brand-text-muted font-medium">
                Crea uno nuevo o únete a uno existente.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {/* Option 1 */}
              <div 
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  workspaceOption === "create" 
                    ? "border-brand-primary bg-white shadow-sm" 
                    : "border-transparent bg-gray-50/50 hover:bg-gray-100/50 border opacity-80"
                }`}
                onClick={() => setWorkspaceOption("create")}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${
                    workspaceOption === "create" ? "bg-brand-primary text-white" : "bg-white border border-gray-200 text-gray-400"
                  }`}>
                    <Plus className={`w-5 h-5 mx-auto ${workspaceOption === "create" ? "text-white fill-current" : ""}`} />
                  </div>
                  <span className={`font-bold text-sm ${workspaceOption === "create" ? "text-brand-text" : "text-gray-500"}`}>Crear nuevo workspace</span>
                </div>
                {workspaceOption === "create" && (
                  <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>

              {/* Option 2 */}
              <div 
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  workspaceOption === "join" 
                    ? "border-brand-primary bg-white shadow-sm" 
                    : "border-transparent bg-gray-50/50 hover:bg-gray-100/50 border opacity-80"
                }`}
                onClick={() => setWorkspaceOption("join")}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${
                    workspaceOption === "join" ? "bg-brand-primary text-white" : "bg-white border border-gray-200 text-gray-500"
                  }`}>
                    <Key className="w-4 h-4 text-current" />
                  </div>
                  <span className={`font-bold text-sm ${workspaceOption === "join" ? "text-brand-text" : "text-gray-500"}`}>Unirse con código</span>
                </div>
                {workspaceOption === "join" && (
                  <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-8">
              {workspaceOption === "create" ? (
                <>
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-brand-text mb-2 block">
                    NOMBRE DEL WORKSPACE
                  </Label>
                  <Input 
                    className="bg-gray-100/80 border-none rounded-xl h-12 px-4 focus-visible:ring-1 focus-visible:ring-brand-primary/20 text-brand-text font-medium" 
                    placeholder="Mi empresa"
                    value={wsName}
                    onChange={(e) => handleWsNameChange(e.target.value)}
                    autoFocus
                  />
                </>
              ) : (
                <>
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-brand-text mb-2 block">
                    CÓDIGO DE INVITACIÓN
                  </Label>
                  <Input 
                    className="bg-gray-100/80 border-none rounded-xl h-12 px-4 focus-visible:ring-1 focus-visible:ring-brand-primary/20 text-brand-text font-medium uppercase tracking-widest" 
                    placeholder="ABCD-1234"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    autoFocus
                  />
                </>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-auto pb-4 pt-10">
            <Button 
              variant="ghost" 
              className="font-bold text-brand-primary hover:text-brand-primary-hover px-0" 
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
            </Button>
            <Button 
              disabled={isPending || (workspaceOption === "create" ? (!wsName.trim() || !wsSlug.trim()) : !joinCode.trim())}
              onClick={workspaceOption === "create" ? handleCreateWorkspace : handleJoinWorkspace}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl h-11 px-6 font-bold shadow-sm shadow-brand-primary/20"
            >
              {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {workspaceOption === "join" ? "Unirse" : "Siguiente"} <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  if (step === "invite") {
    return (
      <AuthLayout centered logoPosition="left">
        <div className="flex flex-col items-center p-2 sm:p-6 text-center max-w-[480px] mx-auto w-full">
          <div className="w-16 h-14 rounded-2xl bg-[#FDE4D0] flex items-center justify-center mb-8 shadow-sm">
            <UserPlus className="w-7 h-7 text-[#A15822]" />
          </div>
          
          <h2 className="text-[26px] sm:text-[32px] font-extrabold text-brand-text mb-3 tracking-tight">
            Invita a tu equipo
          </h2>
          <p className="text-[14px] sm:text-[15px] text-brand-text-muted font-medium mb-10 w-[95%] mx-auto">
            Agrega compañeros para colaborar juntos en tus proyectos.
          </p>

          <div className="w-full space-y-4 mb-8">
            {invites.map((invite, index) => (
              <div key={index} className="flex items-center gap-3">
                <Input 
                  className="flex-1 bg-[#F9FAFB] border-none rounded-xl h-12 px-4 focus-visible:ring-1 focus-visible:ring-brand-primary/20 text-[#111827] font-medium placeholder:text-[#9CA3AF]" 
                  placeholder="nombre@empresa.com"
                  value={invite.email}
                  onChange={(e) => {
                    const newInvites = [...invites]
                    newInvites[index].email = e.target.value
                    setInvites(newInvites)
                  }}
                />
                <div className="relative w-[130px] shrink-0">
                  <select 
                    className="w-full h-12 bg-[#F9FAFB] border-none rounded-xl px-4 appearance-none outline-none font-medium text-[#111827] text-[14px] cursor-pointer focus-visible:ring-1 focus-visible:ring-brand-primary/20"
                    value={invite.role}
                    onChange={(e) => {
                      const newInvites = [...invites]
                      newInvites[index].role = e.target.value
                      setInvites(newInvites)
                    }}
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Lector</option>
                    <option value="admin">Admin</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            ))}
            <div className="flex justify-start pt-1">
              <button 
                className="text-[13px] font-bold text-[#C2611A] hover:text-[#9A4B12] flex items-center gap-1.5 transition-colors"
                onClick={() => setInvites([...invites, { email: "", role: "editor" }])}
              >
                <Plus className="w-4 h-4" /> Agregar otro
              </button>
            </div>
          </div>

          <div className="w-full bg-[#FAFAFA] rounded-xl p-4 flex items-center justify-start gap-4 mb-10">
             <div className="flex -space-x-2.5 shrink-0 pl-1">
               <div className="w-9 h-9 rounded-full border-[2px] border-[#FAFAFA] bg-gray-100 flex items-center justify-center z-30 overflow-hidden shadow-sm"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" alt="avatar" className="w-full h-full object-cover" /></div>
               <div className="w-9 h-9 rounded-full border-[2px] border-[#FAFAFA] bg-gray-100 flex items-center justify-center z-20 overflow-hidden shadow-sm"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede" alt="avatar" className="w-full h-full object-cover" /></div>
               <div className="w-9 h-9 rounded-full border-[2px] border-[#FAFAFA] bg-gray-100 flex items-center justify-center z-10 overflow-hidden shadow-sm"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jocelyn&backgroundColor=d1d4f9" alt="avatar" className="w-full h-full object-cover" /></div>
             </div>
             <span className="text-[13px] sm:text-[14px] font-medium text-brand-text/80 text-left leading-tight">
               Tus colegas de Diseño UX ya están colaborando.
             </span>
          </div>

          <Button
            onClick={() => handleInvite(false)}
            disabled={isPending}
            className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl h-[52px] font-bold text-[15px] mb-6 shadow-sm shadow-brand-primary/20"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            Invitar y continuar
          </Button>

          <button 
            onClick={() => handleInvite(true)}
            disabled={isPending}
            className="text-[11px] uppercase font-bold tracking-widest text-[#9ca3af] hover:text-brand-text transition-colors"
          >
            OMITIR POR AHORA
          </button>
        </div>
      </AuthLayout>
    )
  }

  if (step === "project") {
    return (
      <AuthLayout centered logoPosition="left">
        <div className="flex flex-col p-2 sm:p-4 max-w-[420px] mx-auto w-full">
          <h2 className="text-[28px] font-extrabold text-brand-text mb-2 tracking-tight text-center">
            Crea tu primer proyecto
          </h2>
          <p className="text-[15px] text-brand-text-muted font-medium mb-10 text-center">
            Organiza tus actividades en un proyecto.
          </p>

          <div className="space-y-6 w-full mb-10">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-brand-text mb-1 block">
                NOMBRE DEL PROYECTO
              </Label>
              <Input 
                className="bg-transparent border-t-0 border-l-0 border-r-0 border-b border-brand-border rounded-none h-10 px-0 outline-none focus-visible:ring-0 focus-visible:border-brand-primary shadow-none text-[15px] font-medium placeholder:font-normal placeholder:opacity-50" 
                placeholder="Rediseño app"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-brand-text mb-1 block">
                DESCRIPCIÓN (OPCIONAL)
              </Label>
              <Input 
                className="bg-transparent border-t-0 border-l-0 border-r-0 border-b border-brand-border rounded-none h-10 px-0 outline-none focus-visible:ring-0 focus-visible:border-brand-primary shadow-none text-[15px] font-medium placeholder:font-normal placeholder:opacity-50" 
                placeholder="¿De qué se trata este proyecto?"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-brand-text mb-1 block">
                COLOR DEL PROYECTO
              </Label>
              <div className="flex gap-3">
                {[
                  { id: "orange", hex: "#F97316" },
                  { id: "green", hex: "#22C55E" },
                  { id: "blue", hex: "#3B82F6" },
                  { id: "purple", hex: "#A855F7" },
                  { id: "pink", hex: "#EC4899" },
                  { id: "yellow", hex: "#EAB308" },
                ].map((color) => (
                  <button
                    key={color.id}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      projectColor === color.hex ? "ring-2 ring-offset-2 ring-brand-text" : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setProjectColor(color.hex)}
                  >
                    {projectColor === color.hex && (
                      <div className="w-3 h-3 rounded-full bg-white opacity-40"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={() => handleCreateProject(false)}
            disabled={isPending || !projectName.trim()}
            className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl h-12 font-bold text-[15px] shadow-sm shadow-brand-primary/20"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Crear proyecto y empezar <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return null
}
