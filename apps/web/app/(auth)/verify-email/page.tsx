import Link from "next/link"
import { MailCheck } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata = { title: "Verifica tu correo — CoolDesk" }

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>
}) {
  const { sent } = await searchParams

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
          <MailCheck className="w-7 h-7 text-[#F97316]" />
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-[#1C1917] mb-2">
        {sent ? "Revisa tu correo" : "Verifica tu email"}
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        {sent
          ? "Te enviamos un enlace de verificación. Haz clic en él para activar tu cuenta."
          : "Necesitas verificar tu email para continuar."}
      </p>

      <div className="space-y-3">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full bg-[#F97316] hover:bg-[#ea6c0a] text-white"
          )}
        >
          Volver al inicio de sesión
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        ¿No recibiste el correo? Revisa tu carpeta de spam.
      </p>
    </div>
  )
}
