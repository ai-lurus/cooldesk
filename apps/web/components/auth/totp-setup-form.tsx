"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, ShieldCheck, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

const schema = z.object({
  code: z
    .string()
    .length(6, "El código debe tener 6 dígitos")
    .regex(/^\d+$/, "Solo dígitos"),
})

type FormData = z.infer<typeof schema>

type EnrollState =
  | { status: "password" }
  | { status: "loading" }
  | { status: "ready"; totpURI: string; secret: string; backupCodes: string[] }
  | { status: "error"; message: string }

function extractSecretFromURI(uri: string): string {
  const match = uri.match(/secret=([^&]+)/)
  return match ? match[1] : uri
}

export function TotpSetupForm() {
  const router = useRouter()
  const [enrollState, setEnrollState] = useState<EnrollState>({ status: "password" })
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function startEnroll() {
    if (!password) {
      toast.error("Ingresa tu contraseña para continuar")
      return
    }
    setPasswordLoading(true)

    const { data, error } = await authClient.twoFactor.enable({
      password,
    })

    if (error || !data) {
      setPasswordLoading(false)
      toast.error(error?.message ?? "No se pudo iniciar la configuración.")
      return
    }

    setEnrollState({
      status: "ready",
      totpURI: data.totpURI,
      secret: extractSecretFromURI(data.totpURI),
      backupCodes: data.backupCodes ?? [],
    })
    setPasswordLoading(false)
  }

  async function copySecret() {
    if (enrollState.status !== "ready") return
    await navigator.clipboard.writeText(enrollState.secret)
    setCopied(true)
    toast.success("Clave copiada al portapapeles")
    setTimeout(() => setCopied(false), 2000)
  }

  async function onSubmit(data: FormData) {
    if (enrollState.status !== "ready") return

    setSubmitting(true)

    const { error } = await authClient.twoFactor.verifyTotp({
      code: data.code,
    })

    if (error) {
      setSubmitting(false)
      setError("code", { message: "Código incorrecto. Intenta de nuevo." })
      return
    }

    toast.success("Autenticación de dos factores activada")
    router.push("/settings/security")
    router.refresh()
  }

  // Step 0 — Enter password to start enrollment
  if (enrollState.status === "password") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-brand-text">
          Para configurar la autenticación en dos pasos, primero confirma tu contraseña.
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="enroll-password">Contraseña actual</Label>
          <Input
            id="enroll-password"
            type="password"
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startEnroll()}
          />
        </div>
        <Button
          onClick={startEnroll}
          disabled={passwordLoading || !password}
          className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white"
        >
          {passwordLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <ShieldCheck className="w-4 h-4 mr-2" />
          )}
          Continuar
        </Button>
      </div>
    )
  }

  if (enrollState.status === "loading") {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
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
      {/* Step 1 — Copy secret key */}
      <div>
        <p className="text-sm font-medium text-brand-text mb-3">
          1. Copia esta clave en tu app de autenticación
        </p>
        <p className="text-xs text-gray-500 mb-3">
          Abre tu app (Google Authenticator, Authy, 1Password) y agrega una nueva cuenta usando esta clave manual.
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-sm font-mono text-gray-700 break-all select-all">
              {enrollState.secret}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={copySecret}
            className="shrink-0 h-10 w-10"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Backup codes */}
      {enrollState.backupCodes.length > 0 && (
        <div>
          <p className="text-sm font-medium text-brand-text mb-2">
            Códigos de respaldo
          </p>
          <p className="text-xs text-gray-500 mb-2">
            Guarda estos códigos en un lugar seguro. Los necesitarás si pierdes acceso a tu app de autenticación.
          </p>
          <div className="grid grid-cols-2 gap-1.5 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            {enrollState.backupCodes.map((code, i) => (
              <span key={i} className="text-xs font-mono text-gray-600">
                {code}
              </span>
            ))}
          </div>
        </div>
      )}

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
          className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white"
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
