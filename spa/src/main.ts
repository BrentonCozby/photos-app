import './styles/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'

import { mainRouter } from '@/routes'
import { authService } from '@/services'

import App from './App.vue'

authService.init()

export const app = createApp(App)
export const pinia = createPinia()

app.use(pinia)
app.use(VueQueryPlugin)
app.use(mainRouter)

app.mount('#app')
