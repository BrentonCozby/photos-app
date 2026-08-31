import { PrismaPg } from '@prisma/adapter-pg'

/**
 * The driver adapter does not read the `schema` query parameter out of the
 * connection string, so pass it separately.
 */
export function makeAdapter() {
  const connectionString = process.env.DATABASE_URL || ''
  const schema = connectionString ? new URL(connectionString).searchParams.get('schema') : null

  return new PrismaPg({ connectionString }, schema ? { schema } : undefined)
}
