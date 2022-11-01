import { photosHttp } from './base'
import { PhotoSerializer } from '@/serializers'
import { I_Photo } from '@/models'

export async function getOne(args: {
  id: string
}) {
  const {
    id,
  } = args

  if (!id?.trim()) {
    throw new Error(`Photo ID is required. Received: ${JSON.stringify(id)}`)
  }

  const { data: photosJson } = await photosHttp.get(`/${id}`)

  const photo: I_Photo = PhotoSerializer.deserialize('photo', photosJson)

  return photo
}

export default getOne
