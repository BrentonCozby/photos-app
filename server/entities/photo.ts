import { sanitizeText, sanitizeUrl } from '@/utils'
import { RequiredError, ValidationError } from '@/errors'
import { I_Photo } from '@/types'
import { createId, isValidId } from '@/utils'

interface IArgs extends Partial<I_Photo> {
  description: I_Photo['description']
  name: I_Photo['name']
  url: I_Photo['url']
}

export function makePhoto({
  createdAt = '',
  description,
  id = createId(),
  name,
  updatedAt = '',
  url,
}: IArgs) {
  if (id && !isValidId(id)) {
    throw new ValidationError({ fieldName: 'id', value: id, message: 'Must be a cuid' })
  }

  if (!url || !String(url).trim()) {
    throw new RequiredError({ fieldName: 'url', value: url })
  }

  if (!name || !String(name).trim()) {
    throw new RequiredError({ fieldName: 'name', value: name })
  }

  if (!description || !String(description).trim()) {
    throw new RequiredError({ fieldName: 'description', value: description })
  }

  const timestamp = new Date()
  const newPhoto: I_Photo = {
    createdAt: createdAt || timestamp,
    description: sanitizeText(description),
    id: id,
    name: sanitizeText(name),
    updatedAt: updatedAt || timestamp,
    url: sanitizeUrl(url),
  }

  return Object.freeze(newPhoto)
}
