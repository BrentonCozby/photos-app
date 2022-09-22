import { authService, photoService } from '@/services'
import { T_Controller, T_ExpressHandler } from '@/types'
import { RequiredError, ValidationError } from '@/errors'
import { toHttpResponse } from '@/utils'
import { toExpressHandler } from '@/controllers/utils'
import JSONAPISerializer from 'json-api-serializer'
import isEmpty from 'lodash/isEmpty'

const patchOnePhoto: T_Controller = async (request) => {
  const missingParams = ['oldValues', 'newValues'].filter(name => isEmpty(request.body[name]))

  if (missingParams.length) {
    throw new RequiredError({
      fieldName: missingParams[0],
      value: request.body[missingParams[0]],
    })
  }

  const missingOldValues = Object.keys(request.body.newValues).filter(name => !request.body.oldValues[name])

  if (missingOldValues.length) {
    throw new ValidationError({
      fieldName: missingOldValues[0],
      value: request.body.oldValues[missingOldValues[0]],
      message: 'oldValues must contain all fields within newValues',
      source: {
        pointer: `/newValues/${missingOldValues[0]}`,
      },
    })
  }

  const editOneResponse = await photoService.editOne({
    id:  request.pathParams.id,
    newValues: request.body.newValues,
    oldValues: request.body.oldValues,
  })

  const Serializer = new JSONAPISerializer()

  Serializer.register('photo')

  return toHttpResponse({ body: Serializer.serialize('photo', editOneResponse) })
}

const handlers: T_ExpressHandler[] = [
  authService.verifyAccessToken,
  toExpressHandler(patchOnePhoto),
]

export default handlers
