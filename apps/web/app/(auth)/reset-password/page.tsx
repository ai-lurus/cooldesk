import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { AuthCard } from "@/components/auth/auth-card"
import { AuthLayout } from "@/components/auth/auth-layout"

export const metadata = { title: "Restablecer contraseña — SimplyDesk" }

export default function ResetPasswordPage() {
  return (
    <AuthLayout centered logoPosition="left">
      <AuthCard
        title="Restablecer contraseña"
        subtitle="Crea una nueva contraseña segura para tu cuenta."
      >
        <ResetPasswordForm />
      </AuthCard>
    </AuthLayout>
  )
}
