import { RegisterForm } from "@/components/auth/register-form"
import { AuthCard } from "@/components/auth/auth-card"
import Link from "next/link"

export const metadata = { title: "Crear cuenta — CoolDesk" }

export default function RegisterPage() {
  return (
    <AuthCard
      title="Crear cuenta"
      subtitle={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-brand-primary hover:underline font-medium">
            Iniciar sesión
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  )
}
