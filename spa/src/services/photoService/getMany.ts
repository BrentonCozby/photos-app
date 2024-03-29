import { I_Photo } from '@/models'
import { PhotoSerializer } from '@/serializers'

import { photosHttp } from './base'

export async function getMany(args?: {
  params?: {[key: string]: any}
}) {
  const {
    params,
  } = args || {}

  const { data: photosJson } = await photosHttp.get('/', { params })

  const photos: I_Photo[] = PhotoSerializer.deserialize('photo', photosJson)

  return photos
}

export default getMany
