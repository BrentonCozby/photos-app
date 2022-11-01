import { prisma } from '@/db'
import { NotFoundError } from '@/errors'
import { SIZES_CONFIG, PHOTOS_FILEPATH_BASE } from '@/constants'
import { I_Photo, T_PhotoSizes } from '@/models'
import { Prisma } from '@prisma/client'
import { s3Service } from '@/services'
import { getOne } from './get'

export const removeOne = async (args: {
  id: I_Photo['id']
}) => {
  const {
    id,
  } = args

  const photo = await getOne({ id })

  if (!photo) {
    throw new NotFoundError({ message: 'Photo does not exist.' })
  }

  let hashRecord = await getHashWithPhotoCount(photo)

  if (!hashRecord) {
    throw new NotFoundError({ message: `PhotoHash record not found for photo id: ${photo.id}` })
  }

  try {
    await prisma.photo.delete({
      where: {
        id: id,
      },
    })

    hashRecord = await getHashWithPhotoCount(photo)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundError({ message: 'Photo does not exist.' })
    }

    throw error
  }

  if (hashRecord?._count.photos === 0) {
    await prisma.photoHash.delete({
      where: {
        hash: photo.contentHash,
      },
    })
  }

  const largestSizeConfig = SIZES_CONFIG[photo.largestSizeAvailable as keyof typeof SIZES_CONFIG]
  const sizes = Object.entries(SIZES_CONFIG).reduce((acc, [size, config]) => {
    if (config.width <= largestSizeConfig.width && config.height <= largestSizeConfig.height) {
      acc.push(size as T_PhotoSizes)
    }

    return acc
  }, [] as T_PhotoSizes[])

  s3Service.deleteObjects({
    keys: sizes.map((size) => `${PHOTOS_FILEPATH_BASE}/${photo.contentHash}-${size}.webp`),
  })

  return photo
}

function getHashWithPhotoCount(photo: I_Photo) {
  return prisma.photoHash.findUnique({
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
}
