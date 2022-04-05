import { createApp } from 'vue'
import { VueQueryPlugin } from 'vue-query'
import { AuthService } from '@/services'
import App from './App.vue'

AuthService.init()

const app = createApp(App)

app.use(VueQueryPlugin)

app.mount('#app')
