import { prisma } from '@/db'
import JSONAPISerializer from 'json-api-serializer'
import { makePhoto } from '@/entities'
import { IPhoto } from '@/types'

const editOne = async ({
  id,
  name,
  description,
  url,
}: {
  id: IPhoto['id']
  name: IPhoto['name']
  description: IPhoto['description']
  url: IPhoto['url']
}) => {
  const newPhoto = makePhoto({ name, description, url })

  const dbResponse = await prisma.photo.update({
    where: {
      id,
    },
    data: newPhoto,
  })

  const Serializer = new JSONAPISerializer()

  Serializer.register('photo')

  return Serializer.serialize('photo', dbResponse)
}

export {
  editOne,
}
