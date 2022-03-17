import { photoService } from '@/services'
import { Prisma } from '@prisma/client'
import { Controller } from '@/types'
import { NotFoundError, RequiredError, StaleDataError, ValidationError } from '@/errors'
import { toHttpResponse } from '@/utils'
import isEmpty from 'lodash/isEmpty'
import JSONAPISerializer from 'json-api-serializer'

const PhotoSerializer = new JSONAPISerializer()
PhotoSerializer.register('photo')

export const getManyPhotos: Controller = async () => {
  let responseBody

  try {
    responseBody = await photoService.getMany()
  } catch (error) {
    console.log('TODO: respond with error response')
    throw error
  }

  return toHttpResponse({ body: responseBody })
}

export const getOnePhoto: Controller = async (request) => {
  let responseBody

  try {
    responseBody = await photoService.getOne({
      id: request.pathParams.id,
    })
  } catch (error) {
    console.log('TODO: respond with error response')
    throw error
  }

  return toHttpResponse({ body: responseBody })
}

export const postOnePhoto: Controller = async (request) => {
  let responseBody

  try {
    responseBody = await photoService.addOne({
      name: request.body.name,
      description: request.body.description,
      url: request.body.url,
    })
  } catch (error) {
    console.log('TODO: respond with error response')
    throw error
  }

  return toHttpResponse({ body: responseBody })
}

export const editOnePhoto: Controller = async (request) => {
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

  const currentPhotoJson = await photoService.getOne({ id: request.pathParams.id })

  if (!currentPhotoJson.data) {
    const notFoundError = new NotFoundError({
      message: 'No photo exists for the given id.',
      meta: {
        givenId: request.pathParams.id,
      },
    })

    return toHttpResponse({
      status: 404,
      body: new JSONAPISerializer().serializeError(notFoundError),
    })
  }

  const currentPhoto = PhotoSerializer.deserialize('photo', currentPhotoJson)

  const staleFields = Object.keys(request.body.oldValues).filter(key => {
    return currentPhoto[key] !== request.body.oldValues[key]
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
      body: new JSONAPISerializer().serializeError(staleDataError),
    })
  }

  const { newValues } = request.body

  try {
    responseBody = await photoService.editOne({
      id:  request.pathParams.id,
      data: newValues,
    })
  } catch (error) {
    console.log('TODO: respond with error response')
    throw error
  }

  return toHttpResponse({ body: responseBody })
}

export const deleteOnePhoto: Controller = async (request) => {
  let responseBody

  try {
    responseBody = await photoService.removeOne({
      id: request.pathParams.id,
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        const notFoundError = new NotFoundError({ message: 'Photo does not exist.' })

        return toHttpResponse({
          status: 404,
          body: new JSONAPISerializer().serializeError(notFoundError),
        })
      } else {
        throw error
      }
    } else {
      throw error
    }
  }

  return toHttpResponse({ body: responseBody })
}
