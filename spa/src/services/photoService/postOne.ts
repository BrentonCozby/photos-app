import { photosHttp } from './base'
import { PhotoSerializer } from '@/serializers'
import { I_PhotoNew, I_Photo } from '@/types'

export async function postOne(args: {
  photoData: I_PhotoNew
}) {
  const {
    photoData,
  } = args

  const formData = new FormData()

  Object.entries(photoData).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append('photoFile', photoData.file, photoData.file.name)
    } else {
      formData.append(key, value)
    }
  })

  const { data: photosJson } = await photosHttp.post('/', formData)

  const photo: I_Photo = PhotoSerializer.deserialize('photo', photosJson)

  return photo
}

export default postOne
