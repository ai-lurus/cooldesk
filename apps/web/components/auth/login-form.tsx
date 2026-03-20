"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
})

type FormData = z.infer<typeof schema>

export function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setLoading(false)
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Email o contraseña incorrectos")
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Verifica tu email antes de iniciar sesión")
      } else {
        toast.error("Error al iniciar sesión. Intenta de nuevo.")
      }
      return
    }

    // Check if MFA is required
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aal?.nextLevel === "aal2" && aal.nextLevel !== aal.currentLevel) {
      router.push("/2fa")
      return
    }

    const params = await searchParams
    router.push(params.next ?? "/dashboard")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-brand-text">
          Correo electrónico
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@empresa.com"
          autoComplete="email"
          className="h-12 border-brand-border-muted rounded-xl px-4 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-brand-text-muted/50"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-semibold text-brand-text">
          Contraseña
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          className="h-12 border-brand-border-muted rounded-xl px-4 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-brand-text-muted/50"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl shadow-[0_4px_12px_var(--brand-primary-shadow)] transition-all active:scale-[0.98]"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
        Iniciar sesión
      </Button>
    </form>
  )
}
