import 'express-async-errors'

import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import path from 'path'

import { IS_PROD } from '@/constants'
import { toExpressErrorHandler } from '@/controllers/utils'
import { errorHandlers } from '@/errors'
import { mainRouter } from '@/routes'

async function createApp() {
  const app = express()

  app.use(helmet({
    contentSecurityPolicy: false,
  })) // https://github.com/helmetjs/helmet
  app.use(express.json())
  app.use(cors())
  app.use(mainRouter)

  if (IS_PROD) {
    app.use(express.static(path.resolve(__dirname, '..', 'spa', 'dist')))

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', '..', 'spa', 'dist', 'index.html'))
    })
  } // else, let Vite serve the SPA

  app.use(toExpressErrorHandler(errorHandlers))

  return app
}

export default createApp
