import { PHOTOS_FILEPATH_BASE, SIZES_CONFIG } from '@/constants'
import { photoRepository } from '@/db'
import { NotFoundError } from '@/errors'
import { I_Photo, T_PhotoSizes } from '@/models'
import s3Service from '@/services/s3Service'

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

  const hashRecord = await photoRepository.findHashWithPhotoCount({ contentHash: photo.contentHash })

  if (!hashRecord) {
    throw new NotFoundError({ message: `PhotoHash record not found for photo id: ${photo.id}` })
  }

  const { isHashRemoved } = await photoRepository.deletePhotoAndUnusedHash({
    id,
    contentHash: photo.contentHash,
  })

  // S3 keys come from the content hash, so duplicates share their objects. Only the
  // photo that took the hash record with it may delete them.
  if (isHashRemoved) {
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
  }

  return photo
}
