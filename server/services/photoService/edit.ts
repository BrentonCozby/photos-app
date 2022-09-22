import { prisma } from '@/db'
import { I_Photo } from '@/types'
import { NotFoundError, RequiredError, ValidationError, StaleDataError } from '@/errors'
import { isEmpty } from 'lodash'
import { getOne } from './get'

type T_PhotoKey = keyof I_Photo

export const editOne = async (args: {
  id: I_Photo['id']
  newValues: {
    description?: I_Photo['description']
    name?: I_Photo['name']
  },
  oldValues: I_Photo
}) => {
  const {
    id,
    newValues,
    oldValues,
  } = args

  if (!id) {
    throw new RequiredError({ fieldName: 'id', value: id })
  }

  if (isEmpty(newValues)) {
    throw new RequiredError({ fieldName: 'newValues', value: newValues })
  }

  if (isEmpty(oldValues)) {
    throw new RequiredError({ fieldName: 'oldValues', value: oldValues })
  }

  const missingOldValues = Object.keys(newValues).filter(name => !oldValues[name as T_PhotoKey])

  if (missingOldValues.length) {
    throw new ValidationError({
      fieldName: missingOldValues[0],
      value: oldValues[missingOldValues[0] as T_PhotoKey],
      message: 'oldValues must contain all fields within newValues',
      source: {
        pointer: `/newValues/${missingOldValues[0]}`,
      },
    })
  }

  const currentPhoto = await getOne({ id })

  if (!currentPhoto) {
    throw new NotFoundError({ message: `No photo exists for id: ${id}.` })
  }

  const staleFields = Object.keys(oldValues).filter(key => {
    return (currentPhoto as Record<string, any>)[key] !== oldValues[key as T_PhotoKey]
  })

  if (staleFields.length) {
    throw new StaleDataError({
      resourceName: 'photo',
      staleField: 'oldValues',
      source: {
        pointer: `/oldValues/${staleFields[0]}`,
      },
    })
  }

  return await prisma.photo.update({
    where: {
      id,
    },
    data: {
      ...newValues,
      updatedAt: new Date(),
    },
  })

}
