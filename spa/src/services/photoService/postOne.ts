import { photosHttp } from './base'
import { PhotoSerializer } from '@/serializers'
import { I_PhotoNew, I_Photo } from '@/types'

export async function postOne(args: {
  photoData: I_PhotoNew
  photoFile?: any
}) {
  const {
    photoData,
    photoFile,
  } = args

  const formData = new FormData()

  formData.append('photoFile', photoFile, photoFile.name)

  Object.entries(photoData).forEach(([key, value]) => {
    formData.append(key, value)
  })

  const { data: photosJson } = await photosHttp.post('/', formData)

  const photo: I_Photo = PhotoSerializer.deserialize('photo', photosJson)

  return photo
}

export default postOne
