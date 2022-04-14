import { RequiredError, ValidationError } from '@/errors'
import { authService, photoService } from '@/services'
import { T_Controller, T_ExpressHandler } from '@/types'
import { toHttpResponse, toExpressHandler } from '@/utils'
import { PhotoSerializer } from './serializers'

const postPhoto: T_Controller = async (request) => {
  let responseBody

  try {
    responseBody = await photoService.addOne({
      name: request.body.name,
      description: request.body.description,
      url: request.body.url,
    })
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
  toExpressHandler(postPhoto),
]

export default handlers
