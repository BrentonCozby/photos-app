import JSONAPISerializer from 'json-api-serializer'

import { toExpressHandler } from '@/controllers/utils'
import { T_Controller, T_ExpressHandler } from '@/models'
import { authService } from '@/services'
import { toHttpResponse } from '@/utils'

import { I_PhotoControllerDeps } from './types'

export default function makeDeleteOne({ photoService }: I_PhotoControllerDeps): T_ExpressHandler[] {
  const deleteOnePhoto: T_Controller = async (request) => {
    const photo = await photoService.removeOne({ id: request.pathParams.id })

    const Serializer = new JSONAPISerializer()

    Serializer.register('photo')

    return toHttpResponse({ body: Serializer.serialize('photo', photo) })
  }

  return [
    authService.verifyAccessToken,
    toExpressHandler(deleteOnePhoto),
  ]
}
