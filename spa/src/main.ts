import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from 'vue-query'
import { authService } from '@/services'
import { mainRouter } from '@/routes'
import App from './App.vue'

authService.init()

export const app = createApp(App)
export const pinia = createPinia()

app.use(pinia)
app.use(VueQueryPlugin)
app.use(mainRouter)

app.mount('#app')
