import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { AuthCard } from "@/components/auth/auth-card"
import Link from "next/link"

export const metadata = { title: "Recuperar contraseña — SimplyDesk" }

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace para restablecer tu contraseña."
    >
      <ForgotPasswordForm />

      <div className="mt-4 text-center">
        <Link
          href="/login"
          className="text-sm text-brand-text-muted hover:text-brand-primary transition-colors"
        >
          ← Volver al inicio de sesión
        </Link>
      </div>
    </AuthCard>
  )
}
