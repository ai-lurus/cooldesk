"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

const schema = z.object({
  code: z
    .string()
    .length(6, "El código debe tener 6 dígitos")
    .regex(/^\d+$/, "Solo dígitos"),
})

type FormData = z.infer<typeof schema>

type EnrollState =
  | { status: "loading" }
  | { status: "ready"; factorId: string; qrCode: string; secret: string }
  | { status: "error"; message: string }

export function TotpSetupForm() {
  const router = useRouter()
  const [enrollState, setEnrollState] = useState<EnrollState>({ status: "loading" })
  const [submitting, setSubmitting] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    async function enroll() {
      const supabase = createClient()

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "CoolDesk",
      })

      if (error || !data) {
        setEnrollState({ status: "error", message: "No se pudo iniciar la configuración." })
        return
      }

      setEnrollState({
        status: "ready",
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      })
    }

    enroll()
  }, [])

  async function onSubmit(data: FormData) {
    if (enrollState.status !== "ready") return

    setSubmitting(true)
    const supabase = createClient()

    const { data: challenge, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId: enrollState.factorId })

    if (challengeError || !challenge) {
      toast.error("Error al verificar. Intenta de nuevo.")
      setSubmitting(false)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: enrollState.factorId,
      challengeId: challenge.id,
      code: data.code,
    })

    if (verifyError) {
      setSubmitting(false)
      setError("code", { message: "Código incorrecto. Intenta de nuevo." })
      return
    }

    toast.success("Autenticación de dos factores activada")
    router.push("/settings/security")
    router.refresh()
  }

  if (enrollState.status === "loading") {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#F97316]" />
      </div>
    )
  }

  if (enrollState.status === "error") {
    return (
      <p className="text-sm text-red-500 text-center py-4">{enrollState.message}</p>
    )
  }

  return (
    <div className="space-y-6">
      {/* Step 1 — Scan QR */}
      <div>
        <p className="text-sm font-medium text-[#1C1917] mb-3">
          1. Escanea el código QR con tu app de autenticación
        </p>
        <div className="flex justify-center">
          <div className="p-3 bg-white border border-gray-200 rounded-xl inline-block">
            <Image
              src={enrollState.qrCode}
              alt="QR code para autenticador TOTP"
              width={160}
              height={160}
              unoptimized
            />
          </div>
        </div>
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setShowSecret((v) => !v)}
            className="text-xs text-gray-500 hover:text-[#F97316] transition-colors"
          >
            {showSecret ? "Ocultar clave manual" : "¿No puedes escanear? Ver clave manual"}
          </button>
          {showSecret && (
            <p className="mt-2 text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 break-all">
              {enrollState.secret}
            </p>
          )}
        </div>
      </div>

      {/* Step 2 — Enter code */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="code">
            2. Ingresa el código de 6 dígitos generado por tu app
          </Label>
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            maxLength={6}
            autoComplete="one-time-code"
            className="text-center text-xl tracking-widest"
            {...register("code")}
          />
          {errors.code && (
            <p className="text-xs text-red-500">{errors.code.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#F97316] hover:bg-[#ea6c0a] text-white"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <ShieldCheck className="w-4 h-4 mr-2" />
          )}
          Activar autenticación de dos factores
        </Button>
      </form>
    </div>
  )
}
