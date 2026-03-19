import { ShieldCheck } from "lucide-react"
import { TotpVerifyForm } from "@/components/auth/totp-verify-form"

export const metadata = { title: "Verificación de dos factores — CoolDesk" }

export default function TwoFactorPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-[#F97316]" />
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-[#1C1917] mb-1 text-center">
        Verificación en dos pasos
      </h1>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Ingresa el código de tu app de autenticación para continuar.
      </p>

      <TotpVerifyForm />
    </div>
  )
}
