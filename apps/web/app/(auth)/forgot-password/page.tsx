import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import Link from "next/link"

export const metadata = { title: "Recuperar contraseña — CoolDesk" }

export default function ForgotPasswordPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-[#1C1917] mb-1">
        Recuperar contraseña
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Te enviaremos un enlace para restablecer tu contraseña.
      </p>

      <ForgotPasswordForm />

      <div className="mt-4 text-center">
        <Link
          href="/login"
          className="text-sm text-gray-500 hover:text-[#F97316] transition-colors"
        >
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}
