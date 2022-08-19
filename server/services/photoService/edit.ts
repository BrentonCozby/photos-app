import { prisma } from '@/db'
import { I_Photo } from '@/types'
import { RequiredError, ValidationError } from '@/errors'
import { isEmpty } from 'lodash'

export const editOne = async (args: {
  id: I_Photo['id']
  data: {
    description?: I_Photo['description']
    name?: I_Photo['name']
  }
}) => {
  const {
    id,
    data,
  } = args

  if (!id) {
    throw new RequiredError({ fieldName: 'id', value: id })
  }

  if (isEmpty(data)) {
    throw new ValidationError({ fieldName: 'data', value: data, message: 'Cannot be empty' })
  }

  return await prisma.photo.update({
    where: {
      id,
    },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })

}
