import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const projects = await prisma.project.findMany({ include: { columns: true } })
  console.log(JSON.stringify(projects, null, 2))
}
main()
