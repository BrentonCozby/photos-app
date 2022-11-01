import { authService, photoService } from '@/services'
import { T_Controller, T_ExpressHandler } from '@/models'
import { toHttpResponse } from '@/utils'
import { toExpressHandler } from '@/controllers/utils'
import JSONAPISerializer from 'json-api-serializer'

const deleteOnePhoto: T_Controller = async (request) => {
  const photo = await photoService.removeOne({ id: request.pathParams.id })

  const Serializer = new JSONAPISerializer()

  Serializer.register('photo')

  return toHttpResponse({ body: Serializer.serialize('photo', photo) })
}

const handlers: T_ExpressHandler[] = [
  authService.verifyAccessToken,
  toExpressHandler(deleteOnePhoto),
]

export default handlers
