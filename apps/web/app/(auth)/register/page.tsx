import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"

export const metadata = { title: "Crear cuenta — CoolDesk" }

export default function RegisterPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-[#1C1917] mb-1">
        Crear cuenta
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-[#F97316] hover:underline font-medium">
          Iniciar sesión
        </Link>
      </p>

      <RegisterForm />
    </div>
  )
}
