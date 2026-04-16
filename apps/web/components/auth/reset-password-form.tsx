"use client"

import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6 mt-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">
            NUEVA CONTRASEÑA
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              className="h-12 px-4 pr-10 bg-[#F9F9F8] border-transparent hover:border-brand-border focus:border-brand-primary focus:bg-white transition-all text-[14px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-medium text-brand-text-muted mt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              8 caracteres
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E5E5E5]" />
              1 número
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">
            CONFIRMAR NUEVA CONTRASEÑA
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              className="h-12 px-4 pr-10 bg-[#F9F9F8] border-transparent hover:border-brand-border focus:border-brand-primary focus:bg-white transition-all text-[14px]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-brand-primary hover:bg-brand-primary-hover text-white text-[14px] font-bold mt-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "CAMBIAR CONTRASEÑA"}
        </Button>
      </form>

      <div className="pt-4 flex justify-center text-[13px] font-medium text-brand-text">
        ¿Necesitas ayuda adicional?{" "}
        <Link
          href="/support"
          className="ml-1 font-bold text-brand-primary hover:text-brand-primary-hover transition-colors"
        >
          Contactar soporte
        </Link>
      </div>
    </div>
  )
}
