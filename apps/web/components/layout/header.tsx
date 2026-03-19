import { Bell, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutButton } from "./logout-button"
import Link from "next/link"

interface HeaderProps {
  user: {
    name: string | null
    email: string
    avatar_url: string | null
  }
  title?: string
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

export function Header({ user, title }: HeaderProps) {
  const initials = getInitials(user.name, user.email)

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        {title && (
          <h1 className="text-base font-semibold text-[#1C1917]">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <Bell className="w-5 h-5" />
        </Link>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer">
              <Avatar className="w-7 h-7">
                {user.avatar_url && (
                  <AvatarImage src={user.avatar_url} alt={user.name ?? user.email} />
                )}
                <AvatarFallback className="bg-[#F97316] text-white text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-[#1C1917] hidden sm:block">
                {user.name ?? user.email}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-[#1C1917] truncate">
                {user.name ?? "Sin nombre"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/settings/profile" className="flex w-full">
                Mi perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/settings" className="flex w-full">
                Configuración
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
