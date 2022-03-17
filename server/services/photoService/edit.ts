import { prisma } from '@/db'
import JSONAPISerializer from 'json-api-serializer'
import { IPhoto } from '@/types'
import { RequiredError, ValidationError } from '@/errors'
import { isEmpty } from 'lodash'

export const editOne = async ({
  id,
  data,
}: {
  id: IPhoto['id']
  data: {
    description?: IPhoto['description']
    name?: IPhoto['name']
    url?: IPhoto['url']
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
