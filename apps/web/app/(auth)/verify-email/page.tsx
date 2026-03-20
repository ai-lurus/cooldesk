import Link from "next/link"
import { MailCheck } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AuthCard } from "@/components/auth/auth-card"

export const metadata = { title: "Verifica tu correo — CoolDesk" }

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>
}) {
  const { sent } = await searchParams

  return (
    <AuthCard
      title={sent ? "Revisa tu correo" : "Verifica tu email"}
      subtitle={
        sent
          ? "Te enviamos un enlace de verificación. Haz clic en él para activar tu cuenta."
          : "Necesitas verificar tu email para continuar."
      }
      icon={<MailCheck className="w-7 h-7 text-brand-primary" />}
      showLogo={false}
      centered
    >
      <div className="space-y-3">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full bg-brand-primary hover:bg-brand-primary/90 text-white"
          )}
        >
          Volver al inicio de sesión
        </Link>
      </div>

      <p className="text-xs text-brand-text-muted mt-4 text-center">
        ¿No recibiste el correo? Revisa tu carpeta de spam.
      </p>
    </AuthCard>
  )
}
