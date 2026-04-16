"use client"

import { ArrowLeft, Construction } from "lucide-react"
import Link from "next/link"

export function ForgotPasswordForm() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3 py-4">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
            <Construction className="w-7 h-7 text-amber-500" />
          </div>
        </div>
        <p className="text-sm font-medium text-brand-text">
          La recuperación de contraseña estará disponible pronto.
        </p>
        <p className="text-xs text-brand-text-muted">
          Si necesitas restablecer tu contraseña, contacta al administrador.
        </p>
      </div>

      <div className="pt-4 flex justify-center border-t border-brand-border/50 mt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[13px] font-bold text-brand-primary hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}
