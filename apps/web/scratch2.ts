import { db } from "./lib/db"
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '.env') })

async function main() {
  const users = await db.user.findMany()
  const projects = await db.project.findMany({ include: { columns: true, tasks: true } })
  
  console.log({
    usersCount: users.length,
    projectsCount: projects.length,
    projects: projects.slice(0, 1)
  })
}

main().catch(console.error).finally(() => process.exit(0))
