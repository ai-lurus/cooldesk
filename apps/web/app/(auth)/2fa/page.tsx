import { ShieldCheck } from "lucide-react"
import { TotpVerifyForm } from "@/components/auth/totp-verify-form"
import { AuthCard } from "@/components/auth/auth-card"

export const metadata = { title: "Verificación de dos factores — CoolDesk" }

export default function TwoFactorPage() {
  return (
    <AuthCard
      title="Verificación en dos pasos"
      subtitle="Ingresa el código de tu app de autenticación para continuar."
      icon={<ShieldCheck className="w-7 h-7 text-brand-primary" />}
      showLogo={false}
      centered
    >
      <TotpVerifyForm />
    </AuthCard>
  )
}
