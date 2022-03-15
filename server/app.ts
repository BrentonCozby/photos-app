import path from 'path'
import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import { router } from '@/routes'
import { IS_PROD } from '@/constants'

async function createApp() {
  const app = express()
  
  app.use(express.json())
  app.use(cors())
  app.use(router)
  
  if (IS_PROD) {
    app.use(express.static(path.resolve(__dirname, '..', 'spa', 'dist')))

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', '..', 'spa', 'dist', 'index.html'))
    })
  } // else, let Vite serve the SPA

  return app
}

export default createApp