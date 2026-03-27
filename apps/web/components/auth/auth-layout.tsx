import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { clsx } from "clsx"

interface AuthLayoutProps {
  children: React.ReactNode
  sideContent?: React.ReactNode
  reverse?: boolean
  logoPosition?: "left" | "center"
  centered?: boolean
  singleCard?: boolean
}

export function AuthLayout({
  children,
  sideContent,
  reverse = false,
  logoPosition = "center",
  centered = false,
  singleCard = false,
}: AuthLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-brand-background overflow-hidden relative">
      {/* Header */}
      <header 
        className={clsx(
          "h-14 flex items-center px-4 md:px-8 shrink-0 relative z-20",
          logoPosition === "center" ? "justify-between" : "justify-start gap-2"
        )}
      >
        <Link 
          href="/" 
          className="w-8 h-8 flex items-center justify-center hover:bg-brand-secondary-hover rounded-full transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-brand-text" />
        </Link>
        
        <div className={clsx(
          "flex items-center select-none cursor-default",
          logoPosition === "center" ? "absolute left-1/2 -translate-x-1/2" : "ml-2"
        )}>
          <span className="text-lg font-bold tracking-tight text-brand-text">Simply</span>
          <span className="text-lg font-bold tracking-tight text-brand-primary">Desk</span>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex items-center justify-center p-4 md:px-8 overflow-hidden">
        {singleCard ? (
          <div className="w-full h-full max-w-[1000px] max-h-[800px] bg-white rounded-[28px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.03)] border border-brand-border flex flex-col md:flex-row overflow-hidden">
            {/* Form Side */}
            <div className="flex-1 min-w-0 h-full flex flex-col items-center justify-center p-6 md:p-10 lg:p-12 overflow-y-auto scrollbar-hide">
              <div className="w-full max-w-[420px]">
                {children}
              </div>
            </div>

            {/* Side Content / Image Side */}
            <div className="hidden md:flex flex-1 flex-col justify-center min-w-0 h-full overflow-hidden p-3 lg:p-4">
              <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-[#F1F0EE]">
                {sideContent ? (
                  sideContent
                ) : (
                  <Image
                    src="/auth-bg.png"
                    alt="Authentication background"
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={clsx(
            "w-full h-full flex flex-col gap-8 md:gap-12 min-h-0",
            centered ? "max-w-[500px] justify-center" : "max-w-[1000px] max-h-[800px]",
            reverse ? "md:flex-row-reverse" : "md:flex-row"
          )}>
            {/* Form Side */}
            <div className={clsx(
              "flex-1 min-w-0 h-full flex flex-col items-center justify-center overflow-hidden",
              centered && "w-full"
            )}>
              <div className={clsx(
                "w-full bg-white rounded-[28px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.03)] border border-brand-border p-6 md:p-10 lg:p-12 overflow-y-auto max-h-full scrollbar-hide shrink-0",
                centered ? "max-w-full" : "max-w-[420px]"
              )}>
                {children}
              </div>
            </div>

            {/* Side Content / Image Side */}
            {!centered && (
              <div className="hidden md:flex flex-1 flex-col justify-center min-w-0 h-full overflow-hidden">
                {sideContent ? (
                  <div className="w-full h-full overflow-hidden">
                    {sideContent}
                  </div>
                ) : (
                  <div className="relative w-full aspect-video rounded-[20px] overflow-hidden bg-[#F1F0EE] m-3">
                    <Image
                      src="/auth-bg.png"
                      alt="Authentication background"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="h-14 border-t border-brand-border px-4 md:px-8 flex items-center justify-between text-[10px] font-bold tracking-widest text-[#B3B3B3] uppercase shrink-0">
        <div className="flex items-center gap-1">
          <span className="text-brand-text opacity-40">Simply</span>
          <span className="text-brand-primary opacity-40">Desk</span>
        </div>
        
        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/privacy" className="hover:text-brand-text transition-colors">Privacidad</Link>
          <Link href="/terms" className="hover:text-brand-text transition-colors">Términos</Link>
          <Link href="/support" className="hover:text-brand-text transition-colors">Soporte</Link>
        </nav>

        <div className="opacity-60">
          © {new Date().getFullYear()} SIMPLYDESK INC. 
        </div>
      </footer>
    </div>
  )
}
