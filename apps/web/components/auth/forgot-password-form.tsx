"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

const schema = z.object({
  email: z.string().email("Email inválido"),
})

type FormData = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${location.origin}/reset-password`,
    })

    setLoading(false)

    if (error) {
      toast.error("Error al enviar el correo. Intenta de nuevo.")
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <p className="text-sm text-gray-600">
          Si existe una cuenta con ese email, recibirás el enlace en unos minutos.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2.5">
        <Label 
          htmlFor="email" 
          className="text-[10px] font-bold tracking-widest text-brand-text-muted uppercase ml-1"
        >
          Correo electrónico
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@empresa.com"
          autoComplete="email"
          className="h-12 bg-[#F8F7F5] border-none rounded-xl px-4 text-brand-text placeholder:text-brand-text-muted/40 focus-visible:ring-1 focus-visible:ring-brand-primary/20"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold text-[14px] shadow-[0_8px_16px_-4px_rgba(249,115,22,0.2)]"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <>
            Enviar enlace
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      <div className="pt-4 flex justify-center border-t border-brand-border/50 mt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[13px] font-bold text-brand-primary hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio de sesión
        </Link>
      </div>
    </form>
  )
}
