import { authService, photoService } from '@/services'
import { I_Photo, T_Controller, T_ExpressHandler } from '@/types'
import { toHttpResponse } from '@/utils'
import { toExpressHandler } from '@/controllers/utils'
import JSONAPISerializer from 'json-api-serializer'

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

const handlers: T_ExpressHandler[] = [
  authService.verifyAccessToken,
  toExpressHandler(getManyPhotos),
]

export default handlers
