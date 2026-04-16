"use client"

import { authClient } from "@/lib/auth-client"
import { LogOut } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  return (
    <DropdownMenuItem
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/login")
            },
          },
        })
      }}
      className="text-red-600 cursor-pointer"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Cerrar sesión
    </DropdownMenuItem>
  )
}
