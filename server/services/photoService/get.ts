import { prisma } from '@/db'
import { makePhoto } from '@/entities'
import { RequiredError } from '@/errors'
import { I_Photo } from '@/models'

export const getHash = async (args: {
  contentHash: I_Photo['contentHash']
}) => {
  const {
    contentHash,
  } = args

  if (!contentHash) {
    throw new RequiredError({ fieldName: 'contentHash', value: contentHash })
  }

  return await prisma.photoHash.findUnique({
    where: {
      hash: contentHash,
    },
  })
}

export const getDuplicates = async (args: {
  contentHash: I_Photo['contentHash']
}) => {
  const {
    contentHash,
  } = args

  if (!contentHash) {
    throw new RequiredError({ fieldName: 'contentHash', value: contentHash })
  }

  return await prisma.photo.findMany({
    where: {
      contentHash: contentHash,
    },
  })
}

export const getOne = async (args: {
  id: I_Photo['id']
}) => {
  const {
    id,
  } = args

  if (!id) {
    throw new RequiredError({ fieldName: 'id', value: id })
  }

  const dbResponse = await prisma.photo.findUnique({
    where: {
      id: id,
    },
  })

  let response: I_Photo | null = null

  if (dbResponse) {
    response = await makePhoto(dbResponse)
  }

  return response
}

export const getMany = async (args?: {
  limit?: number
}) => {
  const {
    limit = 25,
  } = args || {}

  const dbResponse = await prisma.photo.findMany({
    take: limit,
  })

  let response: I_Photo[] = []

  if (dbResponse?.length) {
    response = await Promise.all(dbResponse.map(makePhoto))
  }

  return response
}
