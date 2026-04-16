import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { AuthCard } from "@/components/auth/auth-card"
import { AuthLayout } from "@/components/auth/auth-layout"

export const metadata = { title: "Recuperar contraseña — SimplyDesk" }

export default function ForgotPasswordPage() {
  return (
    <AuthLayout centered={true} logoPosition="left">
      <AuthCard
        title="Recuperar contraseña"
        subtitle="Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña."
      >
        <ForgotPasswordForm />
      </AuthCard>
    </AuthLayout>
  )
}
