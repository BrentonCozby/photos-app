import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
import { User, IdToken } from '@auth0/auth0-spa-js'
import { AuthService } from '@/services'

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

AuthService.listen((newState) => {
  const authStore = useAuthStore()

  authStore.$patch({
    isLoading: newState.isLoading,
    isAuthenticated: newState.isAuthenticated,
    error: newState.error,
    accessToken: newState.accessToken,
    userInfo: newState.userInfo,
    idClaims: newState.idClaims,
  })
}, 'useAuthStore')
