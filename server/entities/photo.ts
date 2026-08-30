import { RequiredError, ValidationError } from '@/errors'
import { I_Photo } from '@/models'
import { createId, isValidId, sanitizeText } from '@/utils'

interface I_MakePhotoArgs extends Partial<I_Photo> {
  contentHash: I_Photo['contentHash']
  description: I_Photo['description']
  name: I_Photo['name']
}

export function makePhoto(args: I_MakePhotoArgs) {
  const {
    contentHash,
    createdAt = '',
    description,
    id = createId(),
    isArchived = false,
    largestSizeAvailable = 'xs',
    name,
    updatedAt = '',
  } = args

  if (id && !isValidId(id)) {
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

  const timestamp = new Date()

  const newPhoto: I_Photo = {
    contentHash,
    createdAt: createdAt || timestamp,
    description: sanitizeText(description),
    id,
    isArchived,
    largestSizeAvailable,
    name: sanitizeText(name),
    updatedAt: updatedAt || timestamp,
  }

  return Object.freeze(newPhoto)
}
