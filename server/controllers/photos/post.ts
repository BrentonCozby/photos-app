import { authService, photoService } from '@/services'
import { T_Controller, T_ExpressHandler } from '@/types'
import { toHttpResponse, toExpressHandler } from '@/utils'

const postPhoto: T_Controller = async (request) => {
  let responseBody

  try {
    responseBody = await photoService.addOne({
      name: request.body.name,
      description: request.body.description,
      url: request.body.url,
    })
  } catch (error) {
    console.log('TODO: respond with error response')
    throw error
  }

  return toHttpResponse({ body: responseBody })
}

const handlers: T_ExpressHandler[] = [
  authService.verifyAccessToken,
  toExpressHandler(postPhoto),
]

export default handlers
