import { defineConfig } from 'prisma/config'

// Prisma 7 takes the connection out of schema.prisma. The CLI reads it here.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL || '',
  },
})
