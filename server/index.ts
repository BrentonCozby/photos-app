import path from 'path'
import dotenvFlow from 'dotenv-flow'
import stoppable from 'stoppable'
import { promisify } from 'util'
import createApp from './app'

// add the .env file(s) to process.env
dotenvFlow.config({
  path: path.resolve(__dirname, '..'),
})

const PORT = Number(process.env.SERVER_PORT) || 3000
const HOST = process.env.SERVER_HOST || ''
const SERVER_CLOSE_GRACE = 10000

async function main() {
  const app = await createApp()

  const httpServer = app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`)
  })
  
  const stoppableHttpServer = stoppable(httpServer, SERVER_CLOSE_GRACE)
  const serverClose = promisify(stoppableHttpServer.stop.bind(stoppableHttpServer))
  
  const shutdownMessages: {[key: string]: string} = {
    SIGINT: 'Received SIGINT, probably ctrl-c. Gracefully shutting down the server.',
    SIGTERM: 'Received SIGTERM, probably docker stop. Gracefully shutting down the server.',
  }
  
  async function shutdown(signal: string) {
    console.log(shutdownMessages[signal])
  
    try {
      await serverClose()
      console.log('Server is shut down.')
      process.exitCode = 0
    } catch (err) {
      process.exitCode = 1
      throw err
    }
  }
  
  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

main()