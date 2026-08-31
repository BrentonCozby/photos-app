import JSONAPISerializer from 'json-api-serializer'

import { toExpressHandler } from '@/controllers/utils'
import { T_Controller, T_ExpressHandler } from '@/models'
import { authService, photoService } from '@/services'
import { toHttpResponse } from '@/utils'

const getOnePhoto: T_Controller = async (request) => {
  const photo = await photoService.getOne({
    id: request.pathParams.id,
  })

  const Serializer = new JSONAPISerializer()

  Serializer.register('photo')

  return toHttpResponse({ body: Serializer.serialize('photo', photo) })
}

const handlers: T_ExpressHandler[] = [
  authService.verifyAccessToken,
  toExpressHandler(getOnePhoto),
]

export default handlers
