"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import { randomUUID } from "node:crypto"

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

  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
    select: { name: true },
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000"

  try {
    await Promise.all(
      emailList.map(async (email) => {
        const token = randomUUID()
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

        await db.invitation.upsert({
          where: {
            workspaceId_email: {
              workspaceId,
              email,
            },
          },
          update: {
            role: role as "admin" | "editor" | "viewer",
            invitedBy: session.user.id,
            token,
            expiresAt,
          },
          create: {
            workspaceId,
            email,
            role: role as "admin" | "editor" | "viewer",
            invitedBy: session.user.id,
            token,
            expiresAt,
          },
        })

        await sendEmail({
          to: email,
          subject: `Invitación a unirte a ${workspace?.name || "un workspace"} en CoolDesk`,
          html: `<p>Hola,</p>
<p>Has sido invitado a unirte a <strong>${workspace?.name || "un workspace"}</strong> en CoolDesk con el rol de ${role}.</p>
<p>Haz clic en el siguiente enlace para aceptar la invitación:</p>
<p><a href="${appUrl}/join?token=${token}">Aceptar invitación</a></p>
<p>Este enlace expirará en 7 días.</p>
<p>El equipo de CoolDesk</p>`,
        })
      })
    )
  } catch (error) {
    console.error("[inviteMembers] Error:", error)
    return { error: "Error al crear las invitaciones y enviar los emails." }
  }

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
