"use server"

import { redirect } from "next/navigation"

export async function logout() {
  // Better Auth handles logout via the client-side authClient.signOut()
  // This server action is kept as a fallback redirect only
  redirect("/login")
}
