import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("users")
    .select("id, name, email, avatar_url")
    .eq("id", user.id)
    .single()

  // Fetch user workspaces
  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id, workspaces(id, name, slug)")
    .eq("user_id", user.id)
    .order("invited_at", { ascending: true })
    .limit(10)

  const workspaces =
    memberships
      ?.map((m) => (Array.isArray(m.workspaces) ? m.workspaces[0] : m.workspaces))
      .filter(Boolean) ?? []

  // If no workspace, redirect to onboarding
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") ?? ""
  const isOnboarding = pathname.startsWith("/onboarding")

  if (workspaces.length === 0 && !isOnboarding) {
    redirect("/onboarding")
  }

  const workspace = workspaces[0] as { id: string; name: string; slug: string } | undefined

  // Fetch projects for the current workspace
  const { data: projects } = workspace
    ? await supabase
        .from("projects")
        .select("id, name")
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: true })
    : { data: [] }

  const userDisplay = {
    name: profile?.name ?? null,
    email: profile?.email ?? user.email ?? "",
    avatar_url: profile?.avatar_url ?? null,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#EDE8E0]">
      {workspace ? (
        <Sidebar
          workspace={workspace}
          projects={projects ?? []}
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
