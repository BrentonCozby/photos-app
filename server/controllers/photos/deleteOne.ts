import { authService, photoService } from '@/services'
import { Prisma } from '@prisma/client'
import { T_Controller, T_ExpressHandler } from '@/types'
import { NotFoundError } from '@/errors'
import { toHttpResponse, toExpressHandler } from '@/utils'
import { PhotoSerializer } from './serializers'

const deleteOnePhoto: T_Controller = async (request) => {
  let responseBody

  try {
    responseBody = await photoService.removeOne({
      id: request.pathParams.id,
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        const notFoundError = new NotFoundError({ message: 'Photo does not exist.' })

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
