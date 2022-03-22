import { authService, photoService } from '@/services'
import { T_Controller, T_ExpressHandler } from '@/types'
import { toHttpResponse, toExpressHandler } from '@/utils'

const getManyPhotos: T_Controller = async () => {
  let responseBody

  try {
    responseBody = await photoService.getMany()
  } catch (error) {
    console.log('TODO: respond with error response')
    throw error
  }

  return toHttpResponse({ body: responseBody })
}

const handlers: T_ExpressHandler[] = [
  authService.verifyAccessToken,
  toExpressHandler(getManyPhotos),
]

export default handlers
