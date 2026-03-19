import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export const metadata = { title: "Iniciar sesión — CoolDesk" }

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-[#1C1917] mb-1">
        Iniciar sesión
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-[#F97316] hover:underline font-medium">
          Crear cuenta
        </Link>
      </p>

      <LoginForm searchParams={searchParams} />

      <div className="mt-4 text-center">
        <Link
          href="/forgot-password"
          className="text-sm text-gray-500 hover:text-[#F97316] transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </div>
  )
}
