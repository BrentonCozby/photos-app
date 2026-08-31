import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import path from 'path'

import { IS_PROD } from '@/constants'
import { toExpressErrorHandler } from '@/controllers/utils'
import { makePhotoRepository } from '@/db'
import { errorHandlers } from '@/errors'
import { makeMainRouter } from '@/routes'
import { makePhotoService } from '@/services'

async function createApp() {
  const app = express()

  // Composition root: the only place that gives a use case a concrete adapter.
  const photoService = makePhotoService({ photoRepository: makePhotoRepository() })

  app.use(helmet({
    contentSecurityPolicy: false,
  })) // https://github.com/helmetjs/helmet
  app.use(express.json())
  app.use(cors())
  app.use(makeMainRouter({ photoService }))

  if (IS_PROD) {
    app.use(express.static(path.resolve(__dirname, '..', 'spa', 'dist')))

    app.get('/*splat', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', '..', 'spa', 'dist', 'index.html'))
    })
  } // else, let Vite serve the SPA

  app.use(toExpressErrorHandler(errorHandlers))

  return app
}

export default createApp
