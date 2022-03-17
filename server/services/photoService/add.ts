import { prisma } from '@/db'
import JSONAPISerializer from 'json-api-serializer'
import { makePhoto } from '@/entities'
import { IPhoto } from '@/types'

export const addOne = async ({
  name,
  description,
  url,
}: {
  name: IPhoto['name']
  description: IPhoto['description']
  url: IPhoto['url']
}) => {
  const newPhoto = makePhoto({ name, description, url })

  const dbResponse = await prisma.photo.create({
    data: newPhoto,
  })

  const Serializer = new JSONAPISerializer()

  Serializer.register('photo')

  return Serializer.serialize('photo', dbResponse)
}
