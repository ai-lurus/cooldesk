import { ReactNode } from "react"

interface AuthCardProps {
  children: ReactNode
  title: string
  subtitle?: string | ReactNode
}

export function AuthCard({ 
  children, 
  title, 
  subtitle, 
}: AuthCardProps) {
  return (
    <div className="w-full">
      <div className="mb-6 text-left">
        <h1 className="text-[28px] font-extrabold text-brand-text mb-1.5 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <div className="text-[13px] text-brand-text-muted font-medium opacity-60 leading-relaxed">
            {subtitle}
          </div>
        )}
      </div>

      {children}
    </div>
  )
}
