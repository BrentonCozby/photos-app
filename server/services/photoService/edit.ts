import { prisma } from '@/db'
import JSONAPISerializer from 'json-api-serializer'
import { I_Photo } from '@/types'
import { RequiredError, ValidationError } from '@/errors'
import { isEmpty } from 'lodash'

export const editOne = async ({
  id,
  data,
}: {
  id: I_Photo['id']
  data: {
    description?: I_Photo['description']
    name?: I_Photo['name']
    url?: I_Photo['url']
  }
}) => {
  if (!id) {
    throw new RequiredError({ fieldName: 'id', value: id })
  }

  if (isEmpty(data)) {
    throw new ValidationError({ fieldName: 'data', value: data, message: 'Cannot be empty' })
  }

  const dbResponse = await prisma.photo.update({
    where: {
      id,
    },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })

  const Serializer = new JSONAPISerializer()

  Serializer.register('photo')

  return Serializer.serialize('photo', dbResponse)
}
