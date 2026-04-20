import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Testing prisma.organizacion.findUnique...')
  try {
    const org = await prisma.organizacion.findUnique({
      where: { id: "737c865c-5287-47ef-939d-95a1157a9054" },
      select: { id: true, nombre: true, estado: true }
    })
    console.log('Result:', org)
  } catch (err) {
    console.error('Error in findUnique:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
