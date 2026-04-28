"use client"

import Link from "next/link"
import { LayoutGrid, FileText, Hand, Menu, Settings, Grid2X2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogoutButton } from "@/components/layout/logout-button"

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
  user?: {
    name: string | null
    email: string
    avatar_url: string | null
  }
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const mainNav: NavItem[] = [
  { label: "HOY", href: "/dashboard", icon: Grid2X2 },
  { label: "NOVEDADES", href: "/news", icon: FileText },
  { label: "ATENCIÓN", href: "/attention", icon: Hand },
]

const bottomNav: NavItem[] = [
  { label: "PROYECTOS", href: "/projects", icon: Menu },
  { label: "CONFIGURACIÓN", href: "/settings", icon: Settings },
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
        "flex items-center gap-3 px-6 py-2.5 text-sm font-semibold transition-colors relative",
        active
          ? "text-brand-primary bg-brand-primary/5"
          : "text-brand-text-muted hover:bg-gray-50 hover:text-brand-text"
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="truncate tracking-wide">{label}</span>
      {active && (
        <span className="absolute right-0 top-0 bottom-0 w-0.5 bg-brand-primary" />
      )}
    </Link>
  )
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
  }
  return email[0].toUpperCase()
}

export function Sidebar({ workspace, projects, currentPath, user }: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 h-screen flex flex-col bg-white border-r border-brand-border py-8 pb-6">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 mb-8 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shrink-0">
          <LayoutGrid className="text-white w-4 h-4" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-xl font-bold text-brand-text leading-none tracking-tight">
            Simply<span className="text-brand-primary">DESK</span>
          </span>
          <span className="text-[0.45rem] font-bold text-[#A3A3A3] tracking-[0.2em] leading-none mt-1">
            EFICIENCIA COGNITIVA
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto space-y-1">
        {mainNav.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={currentPath === item.href || (currentPath === "/today" && item.href === "/dashboard")}
          />
        ))}

        <div className="px-6 py-3">
          <div className="h-px bg-gray-200 w-5" />
        </div>

        {bottomNav.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={currentPath === item.href}
          />
        ))}
      </nav>


      {/* Bottom User Profile */}
      {user && (
        <div className="px-6 mt-4 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full text-left outline-none rounded-lg p-1 -m-1 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9 border border-gray-100">
                  {user.avatar_url && (
                    <AvatarImage src={user.avatar_url} alt={user.name ?? user.email} />
                  )}
                  <AvatarFallback className="bg-brand-primary text-white text-xs font-semibold">
                    {getInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex flex-col">
                  <span className="text-sm font-bold text-brand-text truncate leading-tight">
                    {user.name ?? "Usuario"}
                  </span>
                  <span className="text-[10px] text-gray-400 truncate mt-0.5">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" side="top">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-brand-text truncate">
                  {user.name ?? "Sin nombre"}
                </p>
                <p className="text-xs text-brand-text-muted truncate">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings/profile" className="flex w-full cursor-pointer">
                  Mi perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex w-full cursor-pointer">
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </aside>
  )
}
