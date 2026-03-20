import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { AuthCard } from "@/components/auth/auth-card"

export const metadata = { title: "Restablecer contraseña — CoolDesk" }

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Restablecer contraseña"
      subtitle="Elige una nueva contraseña para tu cuenta."
    >
      <ResetPasswordForm />
    </AuthCard>
  )
}
