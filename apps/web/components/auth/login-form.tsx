"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

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
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setLoading(true)

    const { error } = await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: async (ctx) => {
          // Better Auth + twoFactorClient plugin handles 2FA redirect automatically
          // via the twoFactorPage config. If 2FA is not required, redirect normally.
          if (ctx.data.twoFactorRedirect) {
            // The plugin auto-redirects, but just in case:
            router.push("/2fa")
            return
          }
          const params = await searchParams
          router.push(params.next ?? "/dashboard")
          router.refresh()
        },
      }
    )

    if (error) {
      setLoading(false)
      if (error.message?.includes("Invalid") || error.message?.includes("credentials")) {
        toast.error("Email o contraseña incorrectos")
      } else if (error.message?.includes("verified") || error.status === 403) {
        toast.error("Verifica tu email antes de iniciar sesión")
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
      } else {
        toast.error("Error al iniciar sesión. Intenta de nuevo.")
      }
      return
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[9px] uppercase font-bold tracking-widest text-brand-text opacity-70">
            Correo electrónico
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="tu@empresa.com"
              autoComplete="email"
              className="h-11 border-brand-border bg-white rounded-[12px] px-4 focus:ring-0 focus:border-brand-primary transition-all placeholder:text-brand-text-muted/40 text-[14px] font-medium"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-500 font-medium pl-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[9px] uppercase font-bold tracking-widest text-brand-text opacity-70">
            Contraseña
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              autoComplete="current-password"
              className="h-11 border-brand-border bg-white rounded-[12px] px-4 pr-10 focus:ring-0 focus:border-brand-primary transition-all placeholder:text-brand-text-muted/40 text-[14px] font-medium"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4 opacity-40" /> : <Eye className="w-4 h-4 opacity-40" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-500 font-medium pl-1">{errors.password.message}</p>
          )}
          <div className="flex justify-end pt-0.5">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-[11px] font-bold text-brand-primary hover:text-brand-primary-hover transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-[12px] shadow-[0_6px_16px_-4px_rgba(255,122,48,0.25)] transition-all active:scale-[0.98] text-[14px]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Iniciar sesión
        </Button>
      </form>

      <div className="relative py-2 mt-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-brand-border"></span>
        </div>
        <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-[0.2em] text-brand-text opacity-30 bg-white px-3">
          o continuar con
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-10 border-brand-border bg-muted hover:bg-secondary rounded-[11px] font-bold text-[12px] text-brand-text gap-2"
          onClick={() => {}}
        >
          <div className="w-3.5 h-3.5 relative">
             <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
          </div>
          Google
        </Button>
        <Button
          variant="outline"
          className="h-10 border-brand-border bg-muted hover:bg-secondary rounded-[11px] font-bold text-[12px] text-brand-text gap-2"
          onClick={() => {}}
        >
           <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M17.073 21.376c-.56.366-1.353.642-2.234.642-1.45 0-2.457-.864-3.593-.864-1.157 0-2.258.854-3.541.854-.925 0-1.78-.328-2.427-.695-1.579-.904-2.812-2.85-2.812-5.32 0-3.644 2.502-5.83 4.887-5.83 1.134 0 2.052.54 2.89.54.815 0 1.94-.555 2.924-.555 1.258 0 2.222.463 3.012 1.255-2.583 1.485-2.134 5.253.636 6.551-.55 1.442-1.314 2.85-2.342 3.422zm-3.328-16.155c-.015-2.492 2.062-4.524 4.545-4.521.025 2.651-2.097 4.593-4.545 4.521z"/></svg>
          Apple
        </Button>
      </div>

      <div className="pt-2 text-center text-[13px] font-medium text-brand-text opacity-50">
        ¿No tienes cuenta?{" "}
        <button 
          onClick={() => router.push("/register")}
          className="text-brand-primary font-bold hover:underline"
        >
          Regístrate
        </button>
      </div>
    </div>
  )
}
