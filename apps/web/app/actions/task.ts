"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers, cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { TaskPriority } from "@prisma/client"

export async function createTask(data: {
  title: string
  description?: string
  columnId: string
  priority: string
  dueDate?: string
  assigneeId?: string
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const cookieStore = await cookies()
  let activeProjectId = cookieStore.get("active_project_id")?.value

  if (!activeProjectId) {
    const memberships = await db.workspaceMember.findMany({
      where: { userId: session.user.id },
      include: { workspace: { select: { id: true } } },
      orderBy: { invitedAt: "asc" },
      take: 1,
    })

    const workspace = memberships[0]?.workspace
    if (workspace) {
      const firstProject = await db.project.findFirst({
        where: { workspaceId: workspace.id },
        orderBy: { createdAt: "asc" },
      })
      if (firstProject) {
        activeProjectId = firstProject.id
      }
    }
  }

  if (!activeProjectId) {
    throw new Error("No active project selected")
  }

  // Find the max position for the task in the column
  const lastTask = await db.task.findFirst({
    where: { columnId: data.columnId },
    orderBy: { position: 'desc' }
  })
  
  const position = lastTask ? lastTask.position + 1024 : 1024

  // Map Spanish priority strings to Prisma TaskPriority enum
  const priorityMap: Record<string, TaskPriority> = {
    urgente: TaskPriority.urgent,
    alta: TaskPriority.high,
    media: TaskPriority.medium,
    baja: TaskPriority.low,
  }

  const priority = priorityMap[data.priority] || TaskPriority.medium

  // Create the task in the database
  const newTask = await db.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority,
      position,
      projectId: activeProjectId,
      columnId: data.columnId,
      createdById: session.user.id,
      assignedTo: data.assigneeId || null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    }
  })

  revalidatePath("/")
  revalidatePath("/projects")
  
  return { success: true, task: newTask }
}

export async function updateTask(data: {
  id: string
  title?: string
  description?: string
  columnId?: string
  priority?: string
  dueDate?: string | null
  assigneeId?: string | null
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  // Map Spanish priority strings to Prisma TaskPriority enum
  const priorityMap: Record<string, TaskPriority> = {
    urgente: TaskPriority.urgent,
    alta: TaskPriority.high,
    media: TaskPriority.medium,
    baja: TaskPriority.low,
  }

  const updateData: Record<string, unknown> = {}

  if (data.title !== undefined) updateData.title = data.title
  if (data.description !== undefined) updateData.description = data.description
  if (data.columnId !== undefined) updateData.columnId = data.columnId
  if (data.priority !== undefined) updateData.priority = priorityMap[data.priority] || TaskPriority.medium
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null
  if (data.assigneeId !== undefined) updateData.assignedTo = data.assigneeId || null

  const updatedTask = await db.task.update({
    where: { id: data.id },
    data: updateData,
    include: {
      assignee: {
        select: { id: true, name: true }
      }
    }
  })

  revalidatePath("/")
  revalidatePath("/projects")

  return { success: true, task: updatedTask }
}
