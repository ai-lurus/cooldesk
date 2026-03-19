import { redirect } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { TotpSetupForm } from "@/components/auth/totp-setup-form"

export const metadata = { title: "Configurar autenticación — CoolDesk" }

export default async function TwoFactorSetupPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-[#F97316]" />
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-[#1C1917] mb-1 text-center">
        Configurar autenticación en dos pasos
      </h1>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Usa una app como Google Authenticator, Authy o 1Password para mayor seguridad.
      </p>

      <TotpSetupForm />
    </div>
  )
}
