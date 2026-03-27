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
import Link from "next/link"

const schema = z.object({
  name: z.string().min(2, "Nombre muy corto").max(255),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe incluir una mayúscula")
    .regex(/[0-9]/, "Debe incluir un número"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

type FormData = z.infer<typeof schema>

export function RegisterForm() {
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

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name },
        emailRedirectTo: `${location.origin}/verify-email`,
      },
    })

    if (error) {
      setLoading(false)
      if (error.message.includes("already registered")) {
        toast.error("Este email ya está registrado")
      } else {
        toast.error("Error al crear la cuenta. Intenta de nuevo.")
      }
      return
    }

    router.push("/verify-email?sent=true")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label 
          htmlFor="name" 
          className="text-[10px] uppercase font-bold tracking-widest text-brand-text mb-2 block"
        >
          Nombre completo
        </Label>
        <Input
          id="name"
          placeholder="Juan Pérez"
          autoComplete="name"
          className="bg-[#F5F5F5] border-none rounded-xl h-12 px-4 focus-visible:ring-1 focus-visible:ring-brand-primary/20"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-[11px] text-red-500 font-medium px-1 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label 
          htmlFor="email" 
          className="text-[10px] uppercase font-bold tracking-widest text-brand-text mb-2 block"
        >
          Correo electrónico
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john@cooldesk.com"
          autoComplete="email"
          className="bg-[#F5F5F5] border-none rounded-xl h-12 px-4 focus-visible:ring-1 focus-visible:ring-brand-primary/20"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-[11px] text-red-500 font-medium px-1 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label 
            htmlFor="password" 
            className="text-[10px] uppercase font-bold tracking-widest text-brand-text mb-2 block"
          >
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            className="bg-[#F5F5F5] border-none rounded-xl h-12 px-4 focus-visible:ring-1 focus-visible:ring-brand-primary/20"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-[11px] text-red-500 font-medium px-1 mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label 
            htmlFor="confirmPassword" 
            className="text-[10px] uppercase font-bold tracking-widest text-brand-text mb-2 block"
          >
            Confirmar
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            className="bg-[#F5F5F5] border-none rounded-xl h-12 px-4 focus-visible:ring-1 focus-visible:ring-brand-primary/20"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-[11px] text-red-500 font-medium px-1 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl h-12 font-bold transition-all shadow-lg shadow-brand-primary/20"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Crear cuenta
      </Button>

      <p className="text-[9px] text-[#B3B3B3] text-center font-bold tracking-widest uppercase py-4">
        Al crear una cuenta, aceptas nuestros{" "}
        <Link href="/terms" className="underline hover:text-brand-text transition-colors">Términos de servicio</Link> &{" "}
        <Link href="/privacy" className="underline hover:text-brand-text transition-colors">Política de privacidad</Link>
      </p>
    </form>
  )
}
