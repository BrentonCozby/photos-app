import { prisma } from '@/db'
import { I_Photo } from '@/types'

export const addOne = async (args: {
  photo: I_Photo
}) => {
  const {
    photo,
  } = args

  await prisma.photoHash.create({
    data: {
      hash: photo.contentHash,
    },
  })

  const createPhotoData: any = {
    ...photo,
  }

  if (createPhotoData.url) {
    delete createPhotoData.url
  }

  return await prisma.photo.create({
    data: createPhotoData,
  })
}
