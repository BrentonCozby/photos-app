import * as VueRouter from 'vue-router'
import NotFoundPage from '@/pages/NotFoundPage.vue'

const routes: VueRouter.RouteRecordRaw[] = [
  { path: '/:catchAll(.*)*', name: 'NotFoundPage', component: NotFoundPage },
]

export const mainRouter = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})
