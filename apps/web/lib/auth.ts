import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { db } from "./db"
import { twoFactor } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js"
import { sendEmail } from "./email"

export const auth = betterAuth({
  appName: "CoolDesk",
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verifica tu correo electrónico - CoolDesk",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Bienvenido a CoolDesk</h2>
            <p>Hola ${user.name},</p>
            <p>Para activar tu cuenta, por favor verifica tu dirección de correo electrónico haciendo clic en el siguiente enlace:</p>
            <div style="margin: 30px 0;">
              <a href="${url}" style="background-color: #ff7a30; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Verificar Correo Electrónico
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">Si no solicitaste esta cuenta, puedes ignorar este correo.</p>
          </div>
        `,
      })
    },
  },
  plugins: [
    twoFactor(),
    nextCookies(), // must be last — auto-sets cookies in server actions
  ],
})
