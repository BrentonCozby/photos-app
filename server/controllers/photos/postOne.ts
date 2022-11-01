import { authService, photoService } from '@/services'
import { T_Controller, T_ExpressHandler } from '@/models'
import { toExpressHandler, fileUpload } from '@/controllers/utils'
import { toHttpResponse } from '@/utils'
import { RequiredError, ValidationError } from '@/errors'
import JSONAPISerializer from 'json-api-serializer'

const postPhoto: T_Controller = async (request) => {
  const { file, body } = request

  if (!file) {
    throw new RequiredError({ fieldName: 'photoFile', value: file })
  }

  ['name', 'description'].forEach((fieldName) => {
    if (!body[fieldName]) {
      throw new RequiredError({ fieldName: fieldName, value: body[fieldName] })
    }
  })

  const addOneResponse = await photoService.addOne({
    file,
    name: body.name,
    description: body.description,
  }).catch((error) => {
    if (error instanceof ValidationError && error.meta?.fieldName === 'file') {
      throw new ValidationError({
        fieldName: 'photoFile',
        value: error.meta.value,
        message: error.meta.message,
      })
    } else {
      throw error
    }
  })

  const Serializer = new JSONAPISerializer()

  Serializer.register('photo')

  return toHttpResponse({ body: Serializer.serialize('photo', addOneResponse) })
}

const photoFileUpload = fileUpload({ filename: 'photoFile' })

const handlers: T_ExpressHandler[] = [
  authService.verifyAccessToken,
  photoFileUpload.parser,
  toExpressHandler(postPhoto),
  photoFileUpload.cleanup,
]

export default handlers
