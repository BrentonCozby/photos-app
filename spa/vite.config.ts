import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({ mode }) => {
  // @ts-expect-error "need to install @types/node"
  process.env = {
    // @ts-expect-error "need to install @types/node"
    ...process.env,
    ...loadEnv(mode, '..'),
  }

  return defineConfig({
    plugins: [
      vue(),
    ],

    server: {
      host: true,
      // @ts-expect-error "need to install @types/node"
      port: process.env.VITE_SPA_PORT,
    },
  })
}
