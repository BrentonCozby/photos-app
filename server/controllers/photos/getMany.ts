import JSONAPISerializer from 'json-api-serializer'

import { toExpressHandler } from '@/controllers/utils'
import { I_Photo, T_Controller, T_ExpressHandler } from '@/models'
import { authService } from '@/services'
import { toHttpResponse } from '@/utils'

import { I_PhotoControllerDeps } from './types'

export default function makeGetMany({ photoService }: I_PhotoControllerDeps): T_ExpressHandler[] {
  const getManyPhotos: T_Controller = async () => {
    const photos = await photoService.getMany()

    const Serializer = new JSONAPISerializer()

    interface I_ExtraData {
      limit: number
    }

    Serializer.register('photo', {
      topLevelMeta: (data: I_Photo[], extraData: I_ExtraData) => {
        return {
          count: data.length,
          limit: extraData.limit,
        }
      },
    })

    const responseBody = Serializer.serialize('photo', photos, { limit: 25 })

    return toHttpResponse({ body: responseBody })
  }

  return [
    authService.verifyAccessToken,
    toExpressHandler(getManyPhotos),
  ]
}
