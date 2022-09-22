import { authService, photoService, s3Service } from '@/services'
import { Prisma } from '@prisma/client'
import { T_Controller, T_ExpressHandler, T_PhotoSizes } from '@/types'
import { NotFoundError } from '@/errors'
import { toHttpResponse, toExpressHandler } from '@/utils'
import { PhotoSerializer } from './serializers'
import { SIZES_CONFIG, PHOTOS_FILEPATH_BASE } from '@/constants'
import JSONAPISerializer from 'json-api-serializer'

const deleteOnePhoto: T_Controller = async (request) => {
  let responseBody
  const notFoundError = new NotFoundError({ message: 'Photo does not exist.' })

  try {
    const photo = await photoService.getOne({
      id: request.pathParams.id,
    })

    if (!photo) {
      return toHttpResponse({
        status: 404,
        body: PhotoSerializer.serializeError(notFoundError),
      })
    }

    // remove photos variants from aws
    const largestConfig = SIZES_CONFIG[photo.largestSizeAvailable]
    const sizes = Object.entries(SIZES_CONFIG).reduce((acc, [size, config]) => {
      if (config.width <= largestConfig.width && config.height <= largestConfig.height) {
        acc.push(size as T_PhotoSizes)
      }

      return acc
    }, [] as T_PhotoSizes[])

    await s3Service.deleteObjects({
      keys: sizes.map((size) => `${PHOTOS_FILEPATH_BASE}/${photo.contentHash}-${size}.webp`),
    })

    await photoService.removeOne(photo)

    const Serializer = new JSONAPISerializer()

    Serializer.register('photo')

    responseBody = Serializer.serialize('photo', photo)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return toHttpResponse({
          status: 404,
          body: PhotoSerializer.serializeError(notFoundError),
        })
      } else {
        throw error
      }
    } else {
      throw error
    }
  }

  return toHttpResponse({ body: responseBody })
}

const handlers: T_ExpressHandler[] = [
  authService.verifyAccessToken,
  toExpressHandler(deleteOnePhoto),
]

export default handlers
