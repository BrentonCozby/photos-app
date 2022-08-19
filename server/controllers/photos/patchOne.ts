import { authService, photoService } from '@/services'
import { T_Controller, T_ExpressHandler } from '@/types'
import { NotFoundError, RequiredError, StaleDataError, ValidationError } from '@/errors'
import { toHttpResponse, toExpressHandler } from '@/utils'
import { PhotoSerializer } from './serializers'
import JSONAPISerializer from 'json-api-serializer'
import isEmpty from 'lodash/isEmpty'

const patchOnePhoto: T_Controller = async (request) => {
  let responseBody

  const missingParams = ['oldValues', 'newValues'].filter(name => isEmpty(request.body[name]))

  if (missingParams.length) {
    const requiredError = new RequiredError({
      fieldName: missingParams[0],
      value: request.body[missingParams[0]],
    })

    responseBody = PhotoSerializer.serializeError(requiredError)

    return toHttpResponse({ status: 400, body: responseBody })
  }

  const missingOldValues = Object.keys(request.body.newValues).filter(name => !request.body.oldValues[name])

  if (missingOldValues.length) {
    const requiredError = new ValidationError({
      fieldName: missingOldValues[0],
      value: request.body.oldValues[missingOldValues[0]],
      message: 'oldValues must contain all fields within newValues',
      source: {
        pointer: `/newValues/${missingOldValues[0]}`,
      },
    })

    responseBody = PhotoSerializer.serializeError(requiredError)

    return toHttpResponse({ status: 400, body: responseBody })
  }

  const currentPhoto = await photoService.getOne({ id: request.pathParams.id })

  if (!currentPhoto) {
    const notFoundError = new NotFoundError({
      message: 'No photo exists for the given id.',
      meta: {
        givenId: request.pathParams.id,
      },
    })

    return toHttpResponse({
      status: 404,
      body: PhotoSerializer.serializeError(notFoundError),
    })
  }

  const staleFields = Object.keys(request.body.oldValues).filter(key => {
    return (currentPhoto as any)[key] !== request.body.oldValues[key]
  })

  if (staleFields.length) {
    const staleDataError = new StaleDataError({
      resourceName: 'photo',
      staleField: 'oldValues',
      source: {
        pointer: `/oldValues/${staleFields[0]}`,
      },
    })

    return toHttpResponse({
      status: 409,
      body: PhotoSerializer.serializeError(staleDataError),
    })
  }

  const { newValues } = request.body

  let editOneResponse

  try {
    editOneResponse = await photoService.editOne({
      id:  request.pathParams.id,
      data: newValues,
    })
  } catch (error) {
    console.log('TODO: respond with error response')
    throw error
  }

  const Serializer = new JSONAPISerializer()

  Serializer.register('photo')

  responseBody = Serializer.serialize('photo', editOneResponse)

  return toHttpResponse({ body: responseBody })
}

const handlers: T_ExpressHandler[] = [
  authService.verifyAccessToken,
  toExpressHandler(patchOnePhoto),
]

export default handlers
