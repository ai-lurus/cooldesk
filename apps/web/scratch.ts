import { db } from "./lib/db"
async function test() {
  await db.invitation.upsert({
    where: {
      workspaceId_email: {
        workspaceId: "b858485f-8fe0-4389-9b41-e97d19c063f1",
        email: "test@example.com"
      }
    },
    update: {},
    create: {
      workspaceId: "b858485f-8fe0-4389-9b41-e97d19c063f1",
      email: "test@example.com",
      role: "editor",
      invitedBy: "some-user-id",
      token: "some-token",
      expiresAt: new Date(),
    }
  })
}
