import { photosHttp } from './base'
import { PhotoSerializer } from '@/serializers'
import { I_Photo, I_PhotoUpdate } from '@/models'

export async function patchOne(args: {
  photoData: I_PhotoUpdate
}) {
  const {
    photoData,
  } = args

  if (!photoData.id) {
    throw new Error(`Photo ID is required. Received: ${photoData?.id}`)
  }

  const { data: photosJson } = await photosHttp.patch('/', photoData)

  const photo: I_Photo = PhotoSerializer.deserialize('photo', photosJson)

  return photo
}

export default patchOne
