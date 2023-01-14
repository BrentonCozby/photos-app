import fs from 'fs'

import { IMAGE_MIME_TYPES, PHOTOS_FILEPATH_BASE } from '@/constants'
import { prisma } from '@/db'
import { makePhoto } from '@/entities'
import { DuplicationError, RequiredError, ValidationError } from '@/errors'
import { I_Photo, T_File } from '@/models'
import { s3Service } from '@/services'

import { getDuplicates, getHash } from './get'
import { createSizeVariants } from './utils'

export const addOne = async (args: {
  file: T_File
  name: I_Photo['name']
  description: I_Photo['description']
}) => {
  const {
    file,
    name,
    description,
  } = args

  Object.entries(args).forEach(([fieldName, value]) => {
    if (!value) {
      throw new RequiredError({ fieldName, value })
    }
  })

  if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
    throw new ValidationError({
      fieldName: 'file',
      value: file.mimetype.toString(),
      message: `Invalid mimetype. Must be one of [ ${IMAGE_MIME_TYPES.join(', ')} ].`,
    })
  }

  if (file.size > 10 * 1000 * 1000) { // 10MB file size limit
    throw new ValidationError({
      fieldName: 'file',
      value: `${(file.size / 1000 / 1000).toFixed(1)}MB`,
      message: 'Image is too large. Limit: 10MB',
    })
  }

  const fileBuffer = fs.readFileSync(file.path)

  let photo = await makePhoto({
    description: description,
    name: name,
    fileBuffer,
  })

  if (await getHash(photo)) {
    const dupPhotos = await getDuplicates(photo)

    throw new DuplicationError({
      message: 'Photo already exists',
      meta: {
        duplicatePhotos: dupPhotos,
      },
    })
  }

  const { sizeVariants, largestSizeAvailable } = await createSizeVariants({ fileBuffer })

  photo = await makePhoto({
    ...photo,
    largestSizeAvailable,
  })

  await Promise.all(Object.entries(sizeVariants).map(([size, buffer]) => {
    return s3Service.upload({
      filePath: `${PHOTOS_FILEPATH_BASE}/${photo.contentHash}-${size}.webp`,
      content: buffer,
      mimeType: 'image/webp',
    })
  }))

  await prisma.photoHash.create({
    data: {
      hash: photo.contentHash,
    },
  })

  return await prisma.photo.create({
    data: photo,
  })
}
