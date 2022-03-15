import { prisma } from '@/db'
import JSONAPISerializer from 'json-api-serializer'
import { IPhoto } from '@/types'

const getOne = async ({
  id,
}: {
  id: string
}) => {
  const dbResponse = await prisma.photo.findFirst({
    where: {
      id: Number(id),
    },
  })

  const Serializer = new JSONAPISerializer()
  
  Serializer.register('photo')

  return Serializer.serialize('photo', dbResponse)
}

const getMany = async ({
  limit = 25,
}: {
  limit?: number
} = {}) => {
  const dbResponse = await prisma.photo.findMany({
    take: limit,
  })

  const Serializer = new JSONAPISerializer()
  
  interface IExtraData {
    limit: number
  }

  Serializer.register('photo', {
    topLevelMeta: (data: IPhoto[], extraData: IExtraData) => {
      return {
        count: data.length,
        limit: extraData.limit,
      }
    },
  })

  return Serializer.serialize('photo', dbResponse, { limit })
}

export {
  getOne,
  getMany,
}