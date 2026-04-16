import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { OnboardingFlow } from "./onboarding-flow"

export const metadata = { title: "Bienvenido a CoolDesk" }

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/login")

  // If user already has a workspace, go to dashboard
  const membership = await db.workspaceMember.findFirst({
    where: { userId: session.user.id },
    select: { workspaceId: true },
  })

  if (membership) redirect("/dashboard")

  return <OnboardingFlow />
}
