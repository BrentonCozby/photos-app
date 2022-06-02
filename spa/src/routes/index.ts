import * as VueRouter from 'vue-router'
import PhotosPage from '@/pages/PhotosPage/PhotosPage.vue'
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage.vue'

const routes: VueRouter.RouteRecordRaw[] = [
  { path: '/', name: 'PhotosPage', component: PhotosPage },
  { path: '/:catchAll(.*)*', name: 'NotFoundPage', component: NotFoundPage },
]

export const mainRouter = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})
