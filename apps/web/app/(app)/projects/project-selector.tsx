"use client"

import { useTransition } from "react"
import { ChevronDown } from "lucide-react"
import { setActiveProject } from "./actions"

interface Project {
  id: string
  name: string
}

interface ProjectSelectorProps {
  projects: Project[]
  activeProjectId: string
}

export function ProjectSelector({ projects, activeProjectId }: ProjectSelectorProps) {
  const [isPending, startTransition] = useTransition()

  if (projects.length <= 1) {
    const singleProject = projects[0]
    return (
      <h2 className="text-2xl font-extrabold text-brand-text leading-tight">
        {singleProject?.name || "Sin proyectos"}
      </h2>
    )
  }

  return (
    <div className="relative inline-block">
      <select
        value={activeProjectId}
        onChange={(e) => {
          startTransition(() => {
            setActiveProject(e.target.value)
          })
        }}
        disabled={isPending}
        className="text-2xl font-extrabold text-brand-text leading-tight appearance-none bg-transparent cursor-pointer pr-8 outline-none hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id} className="text-base font-normal">
            {p.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-brand-text pointer-events-none" />
    </div>
  )
}
