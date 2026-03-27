import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex flex-col bg-brand-background overflow-hidden">
      {/* Header */}
      <header className="h-14 flex items-center px-4 md:px-8 shrink-0">
        <Link 
          href="/" 
          className="w-8 h-8 flex items-center justify-center hover:bg-brand-secondary-hover rounded-full transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-brand-text" />
        </Link>
        <div className="flex-1 flex justify-center mr-8">
          <div className="flex items-center gap-1.5 group select-none cursor-default">
            <span className="text-lg font-bold tracking-tight text-brand-text">Simply</span>
            <span className="text-lg font-bold tracking-tight text-brand-primary">Desk</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[900px] bg-white rounded-[28px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.03)] border border-brand-border overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
          {/* Left Side: Auth Form */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 lg:p-12 overflow-y-auto">
            <div className="w-full max-w-[320px]">
              {children}
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="hidden md:flex flex-1 relative bg-[#F1F0EE] overflow-hidden m-3 rounded-[20px]">
            <Image
              src="/auth-bg.png"
              alt="Authentication background"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
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
          © 2026 SIMPLYDESK INC. 
        </div>
      </footer>
    </div>
  )
}
