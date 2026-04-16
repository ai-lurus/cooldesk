"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

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
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/login")

  const parsed = workspaceSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { name, slug } = parsed.data

  // Check slug uniqueness
  const existing = await db.workspace.findUnique({
    where: { slug },
    select: { id: true },
  })

  if (existing) {
    return { error: "Ese slug ya está en uso. Elige otro." }
  }

  // Create workspace
  const workspace = await db.workspace.create({
    data: {
      name,
      slug,
      ownerId: session.user.id,
    },
    select: { id: true },
  })

  // Add owner as member
  await db.workspaceMember.create({
    data: {
      workspaceId: workspace.id,
      userId: session.user.id,
      role: "owner",
    },
  })

  return { workspaceId: workspace.id }
}

export async function inviteMembers(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/login")

  const parsed = inviteSchema.safeParse({
    emails: formData.get("emails"),
    workspaceId: formData.get("workspaceId"),
    role: formData.get("role") ?? "editor",
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
    workspaceId,
    email,
    role: role as "admin" | "editor" | "viewer",
    invitedBy: session.user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  }))

  try {
    await db.invitation.createMany({
      data: invitations,
      skipDuplicates: true,
    })
  } catch {
    return { error: "Error al crear las invitaciones." }
  }

  // TODO Sprint 3: send invitation emails via Resend

  return { invited: emailList.length }
}

export async function createFirstProject(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/login")

  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    workspaceId: formData.get("workspaceId"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { name, workspaceId } = parsed.data

  try {
    const project = await db.project.create({
      data: {
        workspaceId,
        name,
        createdById: session.user.id,
      },
      select: { id: true },
    })

    return { projectId: project.id }
  } catch {
    return { error: "Error al crear el proyecto." }
  }
}
