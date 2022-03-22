import { prisma } from '@/db'
import JSONAPISerializer from 'json-api-serializer'
import { makePhoto } from '@/entities'
import { I_Photo } from '@/types'

export const addOne = async ({
  name,
  description,
  url,
}: {
  name: I_Photo['name']
  description: I_Photo['description']
  url: I_Photo['url']
}) => {
  const newPhoto = makePhoto({ name, description, url })

  const dbResponse = await prisma.photo.create({
    data: newPhoto,
  })

  const Serializer = new JSONAPISerializer()

  Serializer.register('photo')

  return Serializer.serialize('photo', dbResponse)
}
