import { prisma } from '@/db'
import JSONAPISerializer from 'json-api-serializer'
import { I_Photo } from '@/types'

export const getOne = async ({
  id,
}: {
  id: string
}) => {
  const dbResponse = await prisma.photo.findFirst({
    where: {
      id: id,
    },
  })

  const Serializer = new JSONAPISerializer()

  Serializer.register('photo')

  return Serializer.serialize('photo', dbResponse)
}

export const getMany = async ({
  limit = 25,
}: {
  limit?: number
} = {}) => {
  const dbResponse = await prisma.photo.findMany({
    take: limit,
  })

  const Serializer = new JSONAPISerializer()

  interface I_ExtraData {
    limit: number
  }

  Serializer.register('photo', {
    topLevelMeta: (data: I_Photo[], extraData: I_ExtraData) => {
      return {
        count: data.length,
        limit: extraData.limit,
      }
    },
  })

  return Serializer.serialize('photo', dbResponse, { limit })
}
