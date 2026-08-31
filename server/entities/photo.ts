import { RequiredError, ValidationError } from '@/errors'
import { I_Photo } from '@/models'
import { isValidId, sanitizeText } from '@/utils'

interface I_MakePhotoArgs extends Partial<I_Photo> {
  contentHash: I_Photo['contentHash']
  createdAt: I_Photo['createdAt']
  description: I_Photo['description']
  id: I_Photo['id']
  name: I_Photo['name']
  updatedAt: I_Photo['updatedAt']
}

/** Same inputs, same photo. The caller supplies the id and the timestamps. */
export function makePhoto(args: I_MakePhotoArgs) {
  const {
    contentHash,
    createdAt,
    description,
    id,
    isArchived = false,
    largestSizeAvailable = 'xs',
    name,
    updatedAt,
  } = args

  if (!id) {
    throw new RequiredError({ fieldName: 'id', value: id })
  }

  if (!isValidId(id)) {
    throw new ValidationError({ fieldName: 'id', value: id, message: 'Must be a cuid' })
  }

  if (!name || !String(name).trim()) {
    throw new RequiredError({ fieldName: 'name', value: name })
  }

  if (!description || !String(description).trim()) {
    throw new RequiredError({ fieldName: 'description', value: description })
  }

  if (!contentHash) {
    throw new RequiredError({ fieldName: 'contentHash', value: contentHash })
  }

  if (!createdAt) {
    throw new RequiredError({ fieldName: 'createdAt', value: createdAt })
  }

  if (!updatedAt) {
    throw new RequiredError({ fieldName: 'updatedAt', value: updatedAt })
  }

  const newPhoto: I_Photo = {
    contentHash,
    createdAt,
    description: sanitizeText(description),
    id,
    isArchived,
    largestSizeAvailable,
    name: sanitizeText(name),
    updatedAt,
  }

  return Object.freeze(newPhoto)
}
