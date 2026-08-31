import { PHOTOS_FILEPATH_BASE, SIZES_CONFIG } from '@/constants'
import { NotFoundError } from '@/errors'
import { I_Photo, T_PhotoSizes } from '@/models'
import s3Service from '@/services/s3Service'

import { makeGetOne } from './get'
import { I_PhotoServiceDeps } from './types'

export const makeRemoveOne = (deps: I_PhotoServiceDeps) => {
  const { photoRepository } = deps
  const getOne = makeGetOne(deps)

  return async (args: {
    id: I_Photo['id']
  }) => {
    const {
      id,
    } = args

    const photo = await getOne({ id })

    if (!photo) {
      throw new NotFoundError({ message: 'Photo does not exist.' })
    }

    let hashRecord = await photoRepository.findHashWithPhotoCount({ contentHash: photo.contentHash })

    if (!hashRecord) {
      throw new NotFoundError({ message: `PhotoHash record not found for photo id: ${photo.id}` })
    }

    await photoRepository.deletePhoto({ id })

    hashRecord = await photoRepository.findHashWithPhotoCount({ contentHash: photo.contentHash })

    // S3 keys come from the content hash, so duplicates share their objects. Only the
    // photo that takes the hash record with it may delete them.
    if (hashRecord?.photoCount === 0) {
      await photoRepository.deleteHash({ contentHash: photo.contentHash })

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
}
