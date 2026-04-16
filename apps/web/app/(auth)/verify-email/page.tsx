import Link from "next/link"
import { AuthCard } from "@/components/auth/auth-card"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Mail, ArrowRight } from "lucide-react"

export const metadata = { title: "Verifica tu correo — SimplyDesk" }

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>
}) {
  const { sent } = await searchParams

  return (
    <AuthLayout centered logoPosition="left">
      <AuthCard
        icon={<Mail className="w-6 h-6" />}
        title="Verifica tu correo electrónico"
        subtitle="Enviamos un enlace de verificación a tu correo. Revisa tu bandeja de entrada para continuar."
      >
        <div className="space-y-4 flex flex-col mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-[12px] shadow-[0_6px_16px_-4px_rgba(255,122,48,0.25)] active:scale-[0.98] text-[14px] font-bold transition-all h-12 px-4 py-2 w-full bg-brand-primary hover:bg-brand-primary-hover text-white flex-row gap-2"
          >
            Ya verifiqué, continuar <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          
          <button
            className="inline-flex items-center justify-center rounded-[12px] text-[14px] font-bold transition-colors h-12 px-4 py-2 w-full text-brand-text hover:bg-[#F2F2F2]"
          >
            Reenviar correo
          </button>
          
          <div className="pt-4 flex justify-center">
            <Link
              href="/login"
              className="text-[14px] font-bold text-brand-primary hover:text-brand-primary-hover transition-colors"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
