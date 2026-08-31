import { Prisma } from '@prisma/client'

import { NotFoundError } from '@/errors'
import { I_PhotoRepository } from '@/models'

import { prisma } from './prisma'

const RECORD_NOT_FOUND = 'P2025'

function isRecordNotFound(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === RECORD_NOT_FOUND
}

export function makePhotoRepository(): I_PhotoRepository {
  return {
    async createHash({ contentHash }) {
      await prisma.photoHash.create({
        data: {
          hash: contentHash,
        },
      })
    },

    createPhoto({ photo }) {
      return prisma.photo.create({
        data: photo,
      })
    },

    async deletePhotoAndUnusedHash({ id, contentHash }) {
      try {
        // The delete, the recount and the hash delete have to see one another, or
        // two concurrent deletes of the last two photos both read a count of zero.
        const isHashRemoved = await prisma.$transaction(async (client) => {
          await client.photo.delete({
            where: {
              id: id,
            },
          })

          const remaining = await client.photo.count({
            where: {
              contentHash: contentHash,
            },
          })

          if (remaining > 0) {
            return false
          }

          try {
            await client.photoHash.delete({
              where: {
                hash: contentHash,
              },
            })
          } catch (error) {
            // Another delete removed the hash record first, so it owns the cleanup.
            if (isRecordNotFound(error)) {
              return false
            }

            throw error
          }

          return true
        })

        return { isHashRemoved }
      } catch (error) {
        if (isRecordNotFound(error)) {
          throw new NotFoundError({ message: 'Photo does not exist.' })
        }

        throw error
      }
    },

    findHash({ contentHash }) {
      return prisma.photoHash.findUnique({
        where: {
          hash: contentHash,
        },
      })
    },

    async findHashWithPhotoCount({ contentHash }) {
      const hashRecord = await prisma.photoHash.findUnique({
        where: {
          hash: contentHash,
        },
        include: {
          _count: {
            select: {
              photos: true,
            },
          },
        },
      })

      if (!hashRecord) {
        return null
      }

      return {
        hash: hashRecord.hash,
        photoCount: hashRecord._count.photos,
      }
    },

    findPhotoById({ id }) {
      return prisma.photo.findUnique({
        where: {
          id: id,
        },
      })
    },

    findPhotos({ limit }) {
      return prisma.photo.findMany({
        take: limit,
      })
    },

    findPhotosByContentHash({ contentHash }) {
      return prisma.photo.findMany({
        where: {
          contentHash: contentHash,
        },
      })
    },

    updatePhoto({ id, values }) {
      return prisma.photo.update({
        where: {
          id,
        },
        data: values,
      })
    },
  }
}
