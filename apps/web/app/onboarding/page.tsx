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

  const user = session.user

  const memberships = await db.workspaceMember.findMany({
    where: { userId: user.id },
    include: {
      workspace: {
        select: { id: true }
      }
    },
    orderBy: { invitedAt: "asc" },
    take: 1,
  })

  let initialStep: "workspace" | "invite" | "project" | "done" = "workspace"
  let initialWorkspaceId = null

  if (memberships.length > 0 && memberships[0].workspace) {
    const workspace = memberships[0].workspace
    initialWorkspaceId = workspace.id

    const projectCount = await db.project.count({
      where: { workspaceId: workspace.id }
    })

    if (projectCount === 0) {
      initialStep = "project"
    } else {
      // If they already have a workspace and a project, they shouldn't be here
      redirect("/dashboard")
    }
  }

  return <OnboardingFlow initialStep={initialStep} initialWorkspaceId={initialWorkspaceId} />
}
