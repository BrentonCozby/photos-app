import { sanitizeText, sanitizeUrl, md5 } from '@/utils'
import { RequiredError } from '@/errors'
import { IPhotoNew } from '@/types'

export function makePhoto({
  contentHash,
  createdAt = '',
  description,
  id = '',
  name,
  updatedAt = '',
  url,
}: IPhotoNew) {
  if (!url || !String(url).trim()) {
    throw new RequiredError({ fieldName: 'url', value: url })
  }

  if (!name || !String(name).trim()) {
    throw new RequiredError({ fieldName: 'name', value: name })
  }

  if (!description || !String(description).trim()) {
    throw new RequiredError({ fieldName: 'description', value: description })
  }

  const newPhoto: any = {
    contentHash: contentHash || md5(id + createdAt + updatedAt + url + description),
    description: sanitizeText(description),
    name: sanitizeText(name),
    url: sanitizeUrl(url),
  }

  if (id) {
    newPhoto.id = id
  }

  if (createdAt) {
    newPhoto.createdAt = createdAt
  }

  if (updatedAt) {
    newPhoto.updatedAt = updatedAt
  }

  return Object.freeze(newPhoto)
}