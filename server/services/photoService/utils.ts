import sharp from 'sharp'

import { SIZES_CONFIG } from '@/constants'
import { T_PhotoSizes } from '@/models'

export async function createSizeVariants(args: {
  fileBuffer: Buffer
}) {
  const { fileBuffer } = args

  const image = await sharp(fileBuffer)
  const metadata = await image.metadata()

  const needsResize: T_PhotoSizes[] = []

  interface I_Result {
    sizeVariants: Partial<Record<T_PhotoSizes, Buffer>>
    largestSizeAvailable: T_PhotoSizes
  }

  const result: I_Result = {
    sizeVariants: {},
    largestSizeAvailable: 'xs',
  }

  Object.entries(SIZES_CONFIG).forEach(([_size, config]) => {
    const size = _size as T_PhotoSizes

    if (Number(metadata.width) > config.width || Number(metadata.height) > config.height) {
      needsResize.push(size)
      result.largestSizeAvailable = size
    }
  })

  if (needsResize.length === 0) {
    result.sizeVariants.xs = await sharp(fileBuffer)
      .webp()
      .toBuffer()
  } else {
    await Promise.all(needsResize.map(async (size) => {
      result.sizeVariants[size] = await sharp(fileBuffer)
        .resize({
          width: SIZES_CONFIG[size].width,
          height: SIZES_CONFIG[size].height,
          fit: sharp.fit.inside,
        })
        .webp()
        .toBuffer()
    }))
  }

  return result
}
