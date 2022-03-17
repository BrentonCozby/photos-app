import { photoService } from '@/services'
import { Prisma } from '@prisma/client'
import { Controller } from '@/types'
import JSONAPISerializer from 'json-api-serializer'
import statuses from 'statuses'

const headers = {
  'Content-Type': 'application/json',
}

export const getManyPhotos: Controller = async () => {
  let responseBody

  try {
    responseBody = await photoService.getMany()
  } catch (error) {
    console.log('TODO: respond with error response')
    throw error
  }

  return {
    headers,
    status: statuses('OK'), // 200
    body: responseBody,
  }
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

  return {
    headers,
    status: statuses('OK'), // 200
    body: responseBody,
  }
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

  return {
    headers,
    status: statuses('OK'), // 200
    body: responseBody,
  }
}

export const deleteOnePhoto: Controller = async (request) => {
  let responseBody
  let status = statuses('OK')

  try {
    responseBody = await photoService.removeOne({
      id: request.pathParams.id,
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        class NotFoundError extends Error {
          status: string | number
          id: string
          code: string
          meta: Record<string, string>

          constructor(message: string, {
            status,
            id,
            code,
            meta,
          }: {
            status: string | number
            id: string
            code: string
            meta: Record<string, string>
          }) {
            super(message)
            this.name = 'NotFoundError'
            this.status = status
            this.id = id
            this.code = code
            this.meta = meta
          }
        }
        const notFoundError = new NotFoundError('Photo does not exist.', {
          status: statuses('Not Found'),
          id: request.pathParams.id,
          code: 'PA0001',
          meta: {
            about: 'photosapp.com/errors/PA0001',
          },
        })

        const Serializer = new JSONAPISerializer()
        responseBody = Serializer.serializeError(notFoundError)
        status = notFoundError.status
      } else {
        throw error
      }
    } else {
      throw error
    }
  }

  return {
    headers,
    status,
    body: responseBody,
  }
}
