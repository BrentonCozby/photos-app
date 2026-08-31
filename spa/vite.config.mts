import vue from '@vitejs/plugin-vue'
import dotenvFlow from 'dotenv-flow'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default () => {
  dotenvFlow.config({
    path: '../',
  })

  process.env.VITE_PHOTOS_SERVICE_PORT = process.env.PHOTOS_SERVICE_PORT
  process.env.VITE_PHOTOS_SERVICE_HOST = process.env.PHOTOS_SERVICE_HOST
  process.env.VITE_AUTH0_DOMAIN = process.env.AUTH0_DOMAIN
  process.env.VITE_AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID
  process.env.VITE_AUTH0_PHOTOS_API_AUD = process.env.AUTH0_PHOTOS_API_AUD

  return defineConfig({
    plugins: [
      vue(),
    ],

    server: {
      host: true,
      port: Number(process.env.SPA_PORT) || undefined,
    },

    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
        '@root': path.resolve(import.meta.dirname),
      },
    },
  })
}
