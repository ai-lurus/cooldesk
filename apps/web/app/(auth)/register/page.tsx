import { RegisterForm } from "@/components/auth/register-form"
import { AuthCard } from "@/components/auth/auth-card"
import { AuthSideContent } from "@/components/auth/auth-side-content"
import { AuthLayout } from "@/components/auth/auth-layout"
import Link from "next/link"

export const metadata = { title: "Crear cuenta — SimplyDesk" }

export default function RegisterPage() {
  return (
    <AuthLayout
      reverse={true}
      logoPosition="left"
      sideContent={
        <AuthSideContent
          tag="Bienvenido"
          title={
            <>
              Es así de <span className="text-brand-primary">simple.</span>
            </>
          }
          description="Entra en un entorno de alta gama diseñado para la concentración. Únete a la fuerza laboral del conocimiento moderno y domina tu flujo."
          imageSrc="/auth-register.png"
        />
      }
      footerContent={
        <p className="text-[9px] text-brand-text-muted/60 text-center font-bold tracking-widest uppercase mt-4">
          Al crear una cuenta, aceptas nuestros{" "}
          <Link href="/terms" className="underline hover:text-brand-text transition-colors">Términos de servicio</Link> &{" "}
          <Link href="/privacy" className="underline hover:text-brand-text transition-colors">Política de privacidad</Link>
        </p>
      }
    >
      <AuthCard
        title="Crear cuenta"
        subtitle="Comienza tu viaje con CoolDesk hoy."
      >
        <RegisterForm />
        
        <div className="mt-8 text-center text-[13px] text-brand-text-muted">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-brand-primary hover:underline font-bold">
            Iniciar sesión
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
