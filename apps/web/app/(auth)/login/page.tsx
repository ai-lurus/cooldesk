import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export const metadata = { title: "Iniciar sesión — CoolDesk" }

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-border p-8">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-1 text-2xl font-bold tracking-tight">
          <span className="text-brand-primary">Cool</span>
          <span className="text-brand-text">Desk</span>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-[20px] font-bold text-brand-text mb-1 leading-tight">
          Iniciar sesión
        </h1>
        <p className="text-sm text-brand-text-muted font-normal">
          Ingresa a tu espacio de trabajo.
        </p>
      </div>

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
    </div>
  )
}
