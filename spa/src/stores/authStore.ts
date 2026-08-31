import { IdToken, User } from '@auth0/auth0-spa-js'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

import { authService } from '@/services'

export const useAuthStore = defineStore('auth', () => {
  const isLoading = ref(true)
  const isAuthenticated = ref(false)
  const error: Ref<Error | undefined> = ref(undefined)
  const accessToken: Ref<string | undefined> = ref(undefined)
  const userInfo: Ref<User | undefined> = ref(undefined)
  const idClaims: Ref<IdToken | undefined> = ref(undefined)

  return {
    isLoading,
    isAuthenticated,
    error,
    accessToken,
    userInfo,
    idClaims,
  }
})

authService.listen((newState) => {
  const authStore = useAuthStore()

  // The object form of $patch cannot express an Error, whose cause is unknown.
  authStore.$patch((state) => {
    state.isLoading = newState.isLoading
    state.isAuthenticated = newState.isAuthenticated
    state.error = newState.error
    state.accessToken = newState.accessToken
    state.userInfo = newState.userInfo
    state.idClaims = newState.idClaims
  })
}, 'useAuthStore')
