import express from 'express'
import { photoService } from '@/services'
import { Prisma } from '@prisma/client'
import JSONAPISerializer from 'json-api-serializer'
import statuses from 'statuses'

/**
 * base route: /photos
 */
const router = express.Router({ mergeParams: true })

router.get('', async (req, res) => {
  const response = await photoService.getMany()

  res.json(response)
})

router.get('/:id', async (req, res) => {
  const response = await photoService.getOne({
    id: req.params.id,
  })

  res.json(response)
})

router.post('', async (req, res) => {
  const response = await photoService.addOne({
    name: req.body.name,
    description: req.body.description,
    url: req.body.url,
  })

  res.json(response)
})

router.delete('/:id', async (req, res) => {
  let response

  try {
    response = await photoService.removeOne({
      id: req.params.id,
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
          id: req.params.id,
          code: 'PA0001',
          meta: {
            about: 'photosapp.com/errors/PA0001',
          },
        })

        const Serializer = new JSONAPISerializer()
        response = Serializer.serializeError(notFoundError)
        res.status(Number(notFoundError.status))
      } else {
        throw error
      }
    } else {
      throw error
    }
  }

  res.json(response)
})

export default router