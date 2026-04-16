import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { db } from "./db"
import { twoFactor } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js"

export const auth = betterAuth({
  appName: "CoolDesk",
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    twoFactor(),
    nextCookies(), // must be last — auto-sets cookies in server actions
  ],
})
