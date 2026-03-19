import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata = { title: "Restablecer contraseña — CoolDesk" }

export default function ResetPasswordPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-[#1C1917] mb-1">
        Restablecer contraseña
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Elige una nueva contraseña para tu cuenta.
      </p>

      <ResetPasswordForm />
    </div>
  )
}
