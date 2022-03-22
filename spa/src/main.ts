import { createApp } from 'vue'
import { Auth0VueClient, createAuth0 } from '@auth0/auth0-vue'
import { VueQueryPlugin } from 'vue-query'
import App from './App.vue'

const app = createApp(App)

const Auth0Plugin = createAuth0({
  domain: String(import.meta.env.VITE_AUTH0_DOMAIN),
  client_id: String(import.meta.env.VITE_AUTH0_CLIENT_ID),
  redirect_uri: window.location.origin,
  audience: String(import.meta.env.VITE_AUTH0_PHOTOS_API_AUD),
  useRefreshTokens: true,
})

app.use(Auth0Plugin)
app.use(VueQueryPlugin)

app.mount('#app')

const auth0: Auth0VueClient = app.config.globalProperties.$auth0
