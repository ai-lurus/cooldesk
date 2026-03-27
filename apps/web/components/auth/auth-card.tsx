import { ReactNode } from "react"
import { clsx } from "clsx"

interface AuthCardProps {
  children: ReactNode
  title: string
  subtitle?: string | ReactNode
  icon?: ReactNode
}

export function AuthCard({ 
  children, 
  title, 
  subtitle, 
  icon,
}: AuthCardProps) {
  return (
    <div className="w-full">
      <div className={clsx(
        "mb-8",
        icon ? "text-center" : "text-left"
      )}>
        {icon && (
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              {icon}
            </div>
          </div>
        )}
        <h1 className={clsx(
          "text-[28px] font-extrabold text-brand-text mb-2 tracking-tight leading-tight",
          icon ? "mx-auto max-w-[300px]" : ""
        )}>
          {title}
        </h1>
        {subtitle && (
          <div className={clsx(
            "text-[14px] text-brand-text-muted font-medium opacity-70 leading-relaxed",
            icon ? "mx-auto max-w-[320px] mt-3" : ""
          )}>
            {subtitle}
          </div>
        )}
      </div>

      {children}
    </div>
  )
}
