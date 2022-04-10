import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from 'vue-query'
import { AuthService } from '@/services'
import App from './App.vue'

AuthService.init()

export const app = createApp(App)
export const pinia = createPinia()

app.use(pinia)
app.use(VueQueryPlugin)

app.mount('#app')
