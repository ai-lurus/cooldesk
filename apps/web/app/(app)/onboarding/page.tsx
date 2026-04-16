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

  return (
    <div className="min-h-screen bg-[#EDE8E0] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-[#1C1917] font-semibold text-xl">CoolDesk</span>
          </div>
        </div>

        <OnboardingFlow />
      </div>
    </div>
  )
}
