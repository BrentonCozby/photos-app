import { photoRepository } from '@/db'
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

  return await photoRepository.findHash({ contentHash })
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

  return await photoRepository.findPhotosByContentHash({ contentHash })
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

  const dbResponse = await photoRepository.findPhotoById({ id })

  let response: I_Photo | null = null

  if (dbResponse) {
    response = makePhoto(dbResponse)
  }

  return response
}

export const getMany = async (args?: {
  limit?: number
}) => {
  const {
    limit = 25,
  } = args || {}

  const dbResponse = await photoRepository.findPhotos({ limit })

  let response: I_Photo[] = []

  if (dbResponse?.length) {
    response = dbResponse.map((photo) => makePhoto(photo))
  }

  return response
}
