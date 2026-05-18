"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function setActiveProject(projectId: string) {
  const cookieStore = await cookies()
  cookieStore.set("active_project_id", projectId, { path: "/" })
  revalidatePath("/")
}
