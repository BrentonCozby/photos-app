import { prisma } from '@/db'

export const removeOne = async (args: {
  id: string
}) => {
  const {
    id,
  } = args

  const photo = await prisma.photo.delete({
    where: {
      id: id,
    },
  })

  if (!photo) {
    return null
  }

  const hashRecord = await prisma.photoHash.findUnique({
    where: {
      hash: photo.contentHash,
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
    throw new Error(`PhotoHash record not found for photo id: ${photo.id}`)
  }

  if (hashRecord._count.photos === 0) {
    await prisma.photoHash.delete({
      where: {
        hash: photo.contentHash,
      },
    })
  }

  return photo
}
