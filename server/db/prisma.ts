import { PrismaClient } from '@prisma/client'

import { makeAdapter } from './adapter'

const prisma = new PrismaClient({ adapter: makeAdapter() })

export {
  prisma,
}
