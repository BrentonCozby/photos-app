import { prisma } from '@/db'
import JSONAPISerializer from 'json-api-serializer'

export const removeOne = async (args: {
  id: string
}) => {
  const {
    id,
  } = args

  const dbResponse = await prisma.photo.delete({
    where: {
      id: id,
    },
  })

  const Serializer = new JSONAPISerializer()

  Serializer.register('photo')

  return Serializer.serialize('photo', dbResponse)
}
