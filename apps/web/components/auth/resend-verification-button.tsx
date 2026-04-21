"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

interface ResendVerificationButtonProps {
  email?: string
}

export function ResendVerificationButton({ email }: ResendVerificationButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleResend() {
    if (!email) {
      toast.error("No se pudo obtener tu correo electrónico. Por favor, intenta registrarte o iniciar sesión de nuevo.")
      return
    }

    setLoading(true)
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/dashboard",
    })
    setLoading(false)

    if (error) {
      toast.error("Error al reenviar el correo. Intenta de nuevo más tarde.")
    } else {
      toast.success("Correo reenviado. Revisa tu bandeja de entrada.")
    }
  }

  return (
    <button
      onClick={handleResend}
      disabled={loading || !email}
      className="inline-flex items-center justify-center rounded-[12px] text-[14px] font-bold transition-colors h-12 px-4 py-2 w-full text-brand-text hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
      Reenviar correo
    </button>
  )
}
