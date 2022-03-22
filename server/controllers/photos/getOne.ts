import { authService, photoService } from '@/services'
import { T_Controller, T_ExpressHandler } from '@/types'
import { toHttpResponse, toExpressHandler } from '@/utils'

const getOnePhoto: T_Controller = async (request) => {
  let responseBody

  try {
    responseBody = await photoService.getOne({
      id: request.pathParams.id,
    })
  } catch (error) {
    console.log('TODO: respond with error response')
    throw error
  }

  return toHttpResponse({ body: responseBody })
}

const handlers: T_ExpressHandler[] = [
  authService.verifyAccessToken,
  toExpressHandler(getOnePhoto),
]

export default handlers
