import { authService, photoService } from '@/services'
import { I_Photo, T_Controller, T_ExpressHandler } from '@/types'
import { toHttpResponse, toExpressHandler } from '@/utils'
import JSONAPISerializer from 'json-api-serializer'

const getManyPhotos: T_Controller = async () => {
  let photos: I_Photo[]

  try {
    photos = await photoService.getMany()
  } catch (error) {
    console.log('TODO: respond with error response')
    throw error
  }

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
