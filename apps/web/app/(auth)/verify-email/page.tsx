import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { AuthCard } from "@/components/auth/auth-card"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Mail, ArrowRight } from "lucide-react"
import { ResendVerificationButton } from "@/components/auth/resend-verification-button"

export const metadata = { title: "Verifica tu correo — SimplyDesk" }

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; email?: string }>
}) {
  const params = await searchParams
  let email = params.email

  if (!email) {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session?.user) {
      email = session.user.email
    }
  }

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
          
          <ResendVerificationButton email={email} />
          
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
