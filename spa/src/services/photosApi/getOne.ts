import { photosHttp } from './base'
import { PhotoSerializer } from '@/serializers'
import { I_Photo } from '@/types'

export async function getOne({
  accessToken,
  id,
}: {
  accessToken: string
  id: string
}) {
  const { data: photosJson } = await photosHttp.get(`/${id}`, { accessToken })

  const photo: I_Photo = PhotoSerializer.deserialize('photo', photosJson)

  return photo
}

export default getOne
