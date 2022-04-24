import path from 'path'
import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import helmet from 'helmet'
import { mainRouter } from '@/routes'
import { IS_PROD } from '@/constants'
import { errorHandlers } from '@/errors'
import { toExpressErrorHandler } from '@/utils'

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
