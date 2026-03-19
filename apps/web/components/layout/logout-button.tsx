"use client"

import { logout } from "@/app/actions/auth"
import { LogOut } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function LogoutButton() {
  return (
    <DropdownMenuItem
      onClick={() => logout()}
      className="text-red-600 cursor-pointer"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Cerrar sesión
    </DropdownMenuItem>
  )
}
