import { redirect } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { TotpSetupForm } from "@/components/auth/totp-setup-form"
import { AuthCard } from "@/components/auth/auth-card"

export const metadata = { title: "Configurar autenticación — SimplyDesk" }

export default async function TwoFactorSetupPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return (
    <AuthCard
      title="Configurar autenticación en dos pasos"
      subtitle="Usa una app como Google Authenticator, Authy o 1Password para mayor seguridad."
    >
      <TotpSetupForm />
    </AuthCard>
  )
}
