import Link from "next/link"
import { ArrowRight, LayoutDashboard, Sparkles, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-brand-background overflow-hidden relative font-sans">
      <main className="flex-1 min-h-0 flex items-center justify-center p-4 md:px-8 overflow-hidden">
        <div className="w-full max-w-[800px] bg-white rounded-[28px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.03)] border border-brand-border p-8 md:p-12 flex flex-col items-center overflow-y-auto scrollbar-hide">
          <div className="flex items-center gap-2 mb-8 select-none">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-bold tracking-tight text-brand-text">Simply</span>
              <span className="text-lg font-bold tracking-tight text-brand-primary">Desk</span>
            </div>
          </div>

          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-[40px] font-extrabold text-brand-text tracking-tight leading-tight">
              ¡Bienvenido a <span className="text-brand-primary">SimplyDesk</span>!
            </h1>
            <p className="text-[15px] font-medium text-brand-text-muted">
              Tu espacio de trabajo inteligente para gestionar proyectos con IA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
            {/* Feature 1 */}
            <div className="bg-muted rounded-[20px] p-6 text-center border border-transparent hover:border-brand-border transition-colors">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-[14px] font-bold text-brand-text mb-2">Tablero Kanban</h3>
              <p className="text-[12px] font-medium text-brand-text-muted leading-relaxed">
                Organiza tu trabajo con columnas personalizables y drag & drop.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-muted rounded-[20px] p-6 text-center border border-transparent hover:border-brand-border transition-colors">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-[14px] font-bold text-brand-text mb-2">Asistente IA</h3>
              <p className="text-[12px] font-medium text-brand-text-muted leading-relaxed">
                Experiencias inteligentes y chat para optimizar tu flujo de trabajo.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-muted rounded-[20px] p-6 text-center border border-transparent hover:border-brand-border transition-colors">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-[14px] font-bold text-brand-text mb-2">Colaboración</h3>
              <p className="text-[12px] font-medium text-brand-text-muted leading-relaxed">
                Trabaja en equipo con asignaciones, comentarios y notificaciones.
              </p>
            </div>
          </div>

          <div className="w-full max-w-[400px] flex flex-col items-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-[14px] font-bold transition-all shadow-[0_6px_16px_-4px_rgba(255,122,48,0.25)] active:scale-[0.98] mb-3"
            >
              Comenzar <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <p className="text-[9px] uppercase font-bold tracking-[0.1em] text-brand-text-muted opacity-60">
              Comenzar es gratis • Sin tarjeta de crédito
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-14 border-t border-brand-border px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold tracking-widest text-brand-text-muted/70 uppercase shrink-0 gap-2 sm:gap-0">
        <div className="opacity-60 text-center sm:text-left">
          © {new Date().getFullYear()} SimplyDesk Inteligencia Artificial. Todos los derechos reservados.
        </div>
        
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/privacy" className="hover:text-brand-text transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-brand-text transition-colors">Terms of Service</Link>
          <Link href="/support" className="hover:text-brand-text transition-colors">Help Center</Link>
        </nav>
      </footer>
    </div>
  )
}
