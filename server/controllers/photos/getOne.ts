import { authService, photoService } from '@/services'
import { T_Controller, T_ExpressHandler } from '@/types'
import { toHttpResponse, toExpressHandler } from '@/utils'
import JSONAPISerializer from 'json-api-serializer'

const getOnePhoto: T_Controller = async (request) => {
  let responseBody

  try {
    const photo = await photoService.getOne({
      id: request.pathParams.id,
    })

    const Serializer = new JSONAPISerializer()

    Serializer.register('photo')

    responseBody = Serializer.serialize('photo', photo)
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
