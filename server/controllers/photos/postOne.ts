import { RequiredError, ValidationError, DuplicationError } from '@/errors'
import { authService, photoService, s3Service } from '@/services'
import { T_Controller, T_ExpressHandler } from '@/types'
import { toHttpResponse, toExpressHandler } from '@/utils'
import { PhotoSerializer } from './serializers'
import { makePhoto } from '@/entities'
import { PHOTOS_FILEPATH_BASE, IMAGE_MIME_TYPES } from '@/constants'
import JSONAPISerializer from 'json-api-serializer'
import multer from 'multer'
import fs from 'fs'
import { noop } from 'lodash'

const multerUpload = multer({
  storage: multer.diskStorage({
    destination: '/tmp/uploads',
    filename(req, file, cb) {
      cb(null, `${Math.random().toString()}-${file.originalname}`)
    },
  }),
})

const postPhoto: T_Controller = async (request) => {
  const { file, body } = request

  let responseBody

  if (!file) {
    return toHttpResponse({
      status: 400,
      body: PhotoSerializer.serializeError(new RequiredError({ fieldName: 'photoFile', value: file })),
    })
  }

  if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
    return toHttpResponse({
      status: 400,
      body: PhotoSerializer.serializeError(new ValidationError({
        fieldName: 'photoFile',
        value: file.mimetype.toString(),
        message: `Invalid mimetype. Must be one of [ ${IMAGE_MIME_TYPES.join(', ')} ].`,
      })),
    })
  }

  if (file.size > 10 * 1000 * 1000) { // 10MB file size limit
    return toHttpResponse({
      status: 400,
      body: PhotoSerializer.serializeError(new ValidationError({
        fieldName: 'photoFile',
        value: `${(file.size / 1000 / 1000).toFixed(1)}MB`,
        message: 'Image is too large. Limit: 10MB',
      })),
    })
  }

  const fileBuffer = fs.readFileSync(file.path)

  let photo = await makePhoto({
    description: body.description,
    name: body.name,
    fileBuffer,
  })

  if (await photoService.getHash(photo)) {
    const dupPhotos = await photoService.getDuplicates(photo)

    return toHttpResponse({
      status: 400,
      body: PhotoSerializer.serializeError(new DuplicationError({
        message: 'Photo already exists',
        meta: {
          duplicatePhotos: dupPhotos,
        },
      })),
    })
  }

  const { sizeVariants, largestSizeAvailable } = await photoService.createSizeVariants({ fileBuffer })

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

  fs.rm(file.path, { force: true }, noop)

  const addOneResponse = await photoService.addOne({ photo })

  const Serializer = new JSONAPISerializer()

  Serializer.register('photo')

  // eslint-disable-next-line prefer-const
  responseBody = Serializer.serialize('photo', addOneResponse)

  return toHttpResponse({ body: responseBody })
}

const handlers: T_ExpressHandler[] = [
  authService.verifyAccessToken,
  multerUpload.single('photoFile'),
  toExpressHandler(postPhoto),
]

export default handlers
