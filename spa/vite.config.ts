/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from 'vite'
const dotenvFlow = require('dotenv-flow')
import vue from '@vitejs/plugin-vue'
const path = require('path')

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
      // @ts-expect-error "need to install @types/node"
      port: process.env.SPA_PORT,
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@root': path.resolve(__dirname),
      },
    },
  })
}
