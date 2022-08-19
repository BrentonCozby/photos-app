import { RequiredError, ValidationError, DuplicationError } from '@/errors'
import { authService, photoService, s3Service } from '@/services'
import { T_Controller, T_ExpressHandler } from '@/types'
import { toHttpResponse, toExpressHandler } from '@/utils'
import { PhotoSerializer } from './serializers'
import { makePhoto } from '@/entities'
import { PHOTOS_FILEPATH_BASE } from '@/constants'
import JSONAPISerializer from 'json-api-serializer'
import multer from 'multer'

const multerUpload = multer()

const postPhoto: T_Controller = async (request) => {
  const { file, body } = request

  let responseBody

  try {
    if (!file) {
      return toHttpResponse({
        status: 400,
        body: PhotoSerializer.serializeError(new Error('Photo file required')),
      })
    }

    const photo = await makePhoto({
      description: body.description,
      name: body.name,
      fileBuffer: file.buffer,
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

    const filePath = `${PHOTOS_FILEPATH_BASE}/${photo.contentHash}`

    await s3Service.upload({
      filePath,
      content: file.buffer,
      mimeType: file.mimetype,
    })

    const addOneResponse = await photoService.addOne({ photo })

    const Serializer = new JSONAPISerializer()

    Serializer.register('photo')

    responseBody = Serializer.serialize('photo', addOneResponse)
  } catch (error) {
    if (error instanceof RequiredError || error instanceof ValidationError) {
      return toHttpResponse({
        status: 400,
        body: PhotoSerializer.serializeError(error),
      })
    }

    throw error
  }

  return toHttpResponse({ body: responseBody })
}

const handlers: T_ExpressHandler[] = [
  authService.verifyAccessToken,
  multerUpload.single('photoFile'),
  toExpressHandler(postPhoto),
]

export default handlers
