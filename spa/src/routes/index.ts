import * as VueRouter from 'vue-router'

import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage.vue'
import PhotosPage from '@/pages/PhotosPage/PhotosPage.vue'

const routes: VueRouter.RouteRecordRaw[] = [
  { path: '/', name: 'PhotosPage', component: PhotosPage },
  { path: '/:catchAll(.*)*', name: 'NotFoundPage', component: NotFoundPage },
]

export const mainRouter = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})
