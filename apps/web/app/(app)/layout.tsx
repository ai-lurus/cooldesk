import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const user = session.user

  // Fetch user profile
  const profile = await db.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, image: true },
  })

  // Fetch user workspaces
  const memberships = await db.workspaceMember.findMany({
    where: { userId: user.id },
    include: {
      workspace: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { invitedAt: "asc" },
    take: 10,
  })

  const workspaces = memberships.map((m) => m.workspace)

  // If no workspace, redirect to onboarding
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") ?? ""
  const isOnboarding = pathname.startsWith("/onboarding")

  if (workspaces.length === 0 && !isOnboarding) {
    redirect("/onboarding")
  }

  const workspace = workspaces[0] as { id: string; name: string; slug: string } | undefined

  // Fetch projects for the current workspace
  const projects = workspace
    ? await db.project.findMany({
        where: { workspaceId: workspace.id },
        select: { id: true, name: true },
        orderBy: { createdAt: "asc" },
      })
    : []

  const userDisplay = {
    name: profile?.name ?? null,
    email: profile?.email ?? user.email ?? "",
    avatar_url: profile?.image ?? null,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-brand-background">
      {workspace ? (
        <Sidebar
          workspace={workspace}
          projects={projects}
          currentPath={pathname}
        />
      ) : null}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={userDisplay} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
