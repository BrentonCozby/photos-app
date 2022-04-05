import { photosHttp } from './base'
import { PhotoSerializer } from '@/serializers'
import { I_Photo } from '@/types'

export async function getMany({
  params,
}: {
  params?: {[key: string]: any}
}) {
  const { data: photosJson } = await photosHttp.get('/', { params })

  const photos: I_Photo[] = PhotoSerializer.deserialize('photo', photosJson)

  return photos
}

export default getMany
