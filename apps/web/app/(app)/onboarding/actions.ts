"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"

const workspaceSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(50),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
})

const projectSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(80),
  workspaceId: z.string().uuid(),
})

const inviteSchema = z.object({
  emails: z.string(),
  workspaceId: z.string().uuid(),
  role: z.enum(["admin", "editor", "viewer"]).default("editor"),
})

export async function createWorkspace(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const parsed = workspaceSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { name, slug } = parsed.data

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from("workspaces")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()

  if (existing) {
    return { error: "Ese slug ya está en uso. Elige otro." }
  }

  // Create workspace
  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .insert({ name, slug, owner_id: user.id })
    .select("id")
    .single()

  if (wsError || !workspace) {
    return { error: "Error al crear el workspace. Intenta de nuevo." }
  }

  // Add owner as admin member
  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({ workspace_id: workspace.id, user_id: user.id, role: "owner" })

  if (memberError) {
    return { error: "Error al configurar el workspace." }
  }

  return { workspaceId: workspace.id }
}

export async function inviteMembers(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const parsed = inviteSchema.safeParse({
    emails: formData.get("emails"),
    workspaceId: formData.get("workspaceId"),
    role: formData.get("role") ?? "member",
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { emails, workspaceId, role } = parsed.data

  const emailList = emails
    .split(/[\n,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes("@"))

  if (emailList.length === 0) {
    return { error: "No se encontraron emails válidos." }
  }

  // Upsert invitations
  const invitations = emailList.map((email) => ({
    workspace_id: workspaceId,
    email,
    role: role as "admin" | "editor" | "viewer",
    invited_by: user.id,
  }))

  const { error } = await supabase.from("invitations").insert(invitations)

  if (error) {
    return { error: "Error al crear las invitaciones." }
  }

  // TODO Sprint 3: send invitation emails via Resend

  return { invited: emailList.length }
}

export async function createFirstProject(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    workspaceId: formData.get("workspaceId"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { name, workspaceId } = parsed.data

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      workspace_id: workspaceId,
      name,
      created_by: user.id,
    })
    .select("id")
    .single()

  if (error || !project) {
    return { error: "Error al crear el proyecto." }
  }

  return { projectId: project.id }
}
