import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AuthCardProps {
  children: ReactNode
  title: string
  subtitle?: string | ReactNode
  icon?: ReactNode
  showLogo?: boolean
  centered?: boolean
}

export function AuthCard({ 
  children, 
  title, 
  subtitle, 
  icon, 
  showLogo = true,
  centered = false
}: AuthCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-border p-8">
      {showLogo && (
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1 text-2xl font-bold tracking-tight">
            <span className="text-brand-primary">Cool</span>
            <span className="text-brand-text">Desk</span>
          </div>
        </div>
      )}

      {icon && (
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      )}

      <div className={cn("mb-6", centered && "text-center")}>
        <h1 className="text-[20px] font-bold text-brand-text mb-1 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <div className="text-sm text-brand-text-muted font-normal">
            {subtitle}
          </div>
        )}
      </div>

      {children}
    </div>
  )
}
