import { photosHttp } from './base'
import { PhotoSerializer } from '@/serializers'
import { I_PhotoNew, I_Photo } from '@/types'

export async function postOne(args: {
  photoData: I_PhotoNew
}) {
  const {
    photoData,
  } = args

  const { data: photosJson } = await photosHttp.post('/', photoData)

  const photo: I_Photo = PhotoSerializer.deserialize('photo', photosJson)

  return photo
}

export default postOne
