import { I_Photo, T_PhotoSizes } from '@/types'
import { CLOUDFRONT_BASE, PHOTOS_FILEPATH_BASE } from '@/constants'

export function buildPhotoUrl(args: {
  contentHash: I_Photo['contentHash']
  size: T_PhotoSizes
}) {
  const {
    contentHash,
    size = 'xs',
  } = args

  return `${CLOUDFRONT_BASE}/${PHOTOS_FILEPATH_BASE}/${contentHash}-${size}.webp`
}
