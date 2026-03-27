import { LoginForm } from "@/components/auth/login-form"
import { AuthCard } from "@/components/auth/auth-card"
import { AuthLayout } from "@/components/auth/auth-layout"

export const metadata = { title: "Iniciar sesión — SimplyDesk" }

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  return (
    <AuthLayout singleCard={true}>
      <AuthCard
        title="Iniciar sesión"
        subtitle="Bienvenido de nuevo a la gestión inteligente."
      >
        <LoginForm searchParams={searchParams} />
      </AuthCard>
    </AuthLayout>
  )
}
