import { I_Photo } from '@/models'
import { PhotoSerializer } from '@/serializers'

import { photosHttp } from './base'

export async function deleteOne(args: {
  id: I_Photo['id']
}) {
  const {
    id,
  } = args

  if (!id?.trim()) {
    throw new Error(`Photo ID is required. Received: ${JSON.stringify(id)}`)
  }

  const { data: photosJson } = await photosHttp.delete(`/${id}`)

  const photo: I_Photo = PhotoSerializer.deserialize('photo', photosJson)

  return photo
}

export default deleteOne
