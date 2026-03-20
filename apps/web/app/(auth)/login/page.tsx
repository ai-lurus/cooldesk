import { LoginForm } from "@/components/auth/login-form"
import { AuthCard } from "@/components/auth/auth-card"
import Link from "next/link"

export const metadata = { title: "Iniciar sesión — CoolDesk" }

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  return (
    <AuthCard
      title="Iniciar sesión"
      subtitle="Ingresa a tu espacio de trabajo."
    >
      <LoginForm searchParams={searchParams} />

      <div className="mt-4 text-center">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-brand-primary hover:underline transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <div className="my-4 flex items-center justify-center gap-4 text-gray-300">
        <div className="h-px w-8 bg-gray-200" />
        <span className="text-xs font-medium text-gray-400">o</span>
        <div className="h-px w-8 bg-gray-200" />
      </div>

      <Link
        href="/demo"
        className="inline-flex items-center justify-center w-full h-12 border border-brand-secondary-border text-brand-text-muted font-semibold hover:bg-brand-secondary-hover transition-colors rounded-xl text-sm"
      >
        Demo rápido →
      </Link>

      <div className="mt-4 text-center text-sm font-medium text-brand-text-muted">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-brand-primary font-bold hover:underline">
          Regístrate
        </Link>
      </div>
    </AuthCard>
  )
}
