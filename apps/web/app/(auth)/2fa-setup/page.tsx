import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { TotpSetupForm } from "@/components/auth/totp-setup-form"
import { AuthCard } from "@/components/auth/auth-card"

export const metadata = { title: "Configurar autenticación — CoolDesk" }

export default async function TwoFactorSetupPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/login")

  return (
    <AuthCard
      title="Configurar autenticación en dos pasos"
      subtitle="Usa una app como Google Authenticator, Authy o 1Password para mayor seguridad."
    >
      <TotpSetupForm />
    </AuthCard>
  )
}
