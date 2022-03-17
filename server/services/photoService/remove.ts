import { prisma } from '@/db'
import JSONAPISerializer from 'json-api-serializer'

const removeOne = async ({
  id,
}: {
  id: string
}) => {
  const dbResponse = await prisma.photo.delete({
    where: {
      id: id,
    },
  })

  const Serializer = new JSONAPISerializer()

  Serializer.register('photo')

  return Serializer.serialize('photo', dbResponse)
}

export {
  removeOne,
}
