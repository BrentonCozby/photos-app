import { sanitizeText } from '@/utils'
import { RequiredError, ValidationError } from '@/errors'
import { I_Photo } from '@/models'
import { createId, isValidId } from '@/utils'
import Jimp from 'jimp'

interface I_MakePhotoArgs extends Partial<I_Photo> {
  description: I_Photo['description']
  fileBuffer?: Buffer
  name: I_Photo['name']
}

export async function makePhoto(args: I_MakePhotoArgs) {
  const {
    contentHash = '',
    createdAt = '',
    description,
    fileBuffer,
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

  if (!contentHash && !fileBuffer) {
    throw new ValidationError({ fieldName: 'fileBuffer', value: fileBuffer, message: 'If no contentHash is provided, fileBuffer is required.' })
  }

  let newContentHash = ''

  if (!contentHash) {
    const jimpInstance = await Jimp.read(fileBuffer as Buffer)

    newContentHash = jimpInstance.hash()
  }

  const timestamp = new Date()

  const newPhoto: I_Photo = {
    contentHash: contentHash || newContentHash,
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
