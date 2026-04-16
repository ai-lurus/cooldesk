import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
  subject: string
  html: string
}) {
  // Use onboarding@resend.dev for testing, use production domain if available and verified
  const fromAddress = process.env.NODE_ENV === "production" 
    ? "CoolDesk <noreply@cooldesk.app>" 
    : "CoolDesk <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to,
    subject,
    html,
  })

  if (error) {
    console.error("[email] Failed to send:", error);
    return { data: null, error };
  }

  console.log("[email] Sent successfully:", data);
  return { data, error: null };
}
