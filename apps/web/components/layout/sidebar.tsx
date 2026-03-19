import Link from "next/link"
import { LayoutDashboard, FolderKanban, Clock, AlertCircle, Sparkles, Settings, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProject {
  id: string
  name: string
}

interface SidebarProps {
  workspace: {
    id: string
    name: string
    slug: string
  }
  projects: SidebarProject[]
  currentPath: string
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const mainNav: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: LayoutDashboard },
  { label: "Hoy", href: "/today", icon: Clock },
  { label: "En atención", href: "/attention", icon: AlertCircle },
]

const bottomNav: NavItem[] = [
  { label: "Configuración", href: "/settings", icon: Settings },
]

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: NavItem & { active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
        active
          ? "bg-[#F97316]/10 text-[#F97316] font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-[#1C1917]"
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  )
}

export function Sidebar({ workspace, projects, currentPath }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 h-screen flex flex-col bg-white border-r border-gray-200">
      {/* Logo + workspace */}
      <div className="h-14 flex items-center px-4 border-b border-gray-200 gap-2 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[#F97316] flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-xs">C</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1C1917] truncate leading-tight">
            {workspace.name}
          </p>
          <p className="text-xs text-gray-400 truncate leading-tight">CoolDesk</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {mainNav.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={currentPath === item.href}
          />
        ))}

        {/* Projects section */}
        {projects.length > 0 && (
          <div className="pt-4 pb-1">
            <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Proyectos
            </p>
            <div className="space-y-0.5">
              {projects.map((project) => (
                <NavLink
                  key={project.id}
                  href={`/projects/${project.id}`}
                  icon={FolderKanban}
                  label={project.name}
                  active={currentPath === `/projects/${project.id}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* AI assistant — Sprint 4 */}
        <div className="pt-4">
          <Link
            href="/ai"
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
              currentPath === "/ai"
                ? "bg-[#7C5CFC]/10 text-[#7C5CFC] font-medium"
                : "text-gray-600 hover:bg-[#7C5CFC]/5 hover:text-[#7C5CFC]"
            )}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Asistente IA</span>
            <span className="ml-auto text-xs bg-[#7C5CFC]/10 text-[#7C5CFC] px-1.5 py-0.5 rounded font-medium">
              Beta
            </span>
          </Link>
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-200 space-y-0.5">
        {bottomNav.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={currentPath === item.href}
          />
        ))}

        {/* Upgrade badge for free plan */}
        <div className="mt-2 p-2.5 rounded-lg bg-gradient-to-br from-[#F97316]/10 to-[#7C5CFC]/10 border border-[#F97316]/20">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="w-3.5 h-3.5 text-[#F97316]" />
            <span className="text-xs font-semibold text-[#1C1917]">Plan Free</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">1 proyecto · 3 miembros</p>
          <Link
            href="/settings/billing"
            className="block text-center text-xs font-medium text-[#F97316] hover:underline"
          >
            Mejorar plan →
          </Link>
        </div>
      </div>
    </aside>
  )
}
