import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url().optional(),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().default("noreply@cooldesk.app"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  AI_PROVIDER: z.enum(["anthropic", "ollama"]).default("ollama"),
  OLLAMA_BASE_URL: z.string().url().optional(),
  OLLAMA_MODEL: z.string().optional(),
})

export const env = envSchema.parse(process.env)
