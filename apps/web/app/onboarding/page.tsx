import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

import { OnboardingFlow } from "./onboarding-flow"

export const metadata = { title: "Bienvenido a CoolDesk" }

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/login")



  return <OnboardingFlow />
}
