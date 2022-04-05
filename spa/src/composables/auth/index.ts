import { ref, Ref } from 'vue'
import { AuthService } from '@/services'
import { User, IdToken } from '@auth0/auth0-spa-js'

const isLoading = ref(true)
const isAuthenticated = ref(false)
const error: Ref<unknown | Error | undefined> = ref(undefined)
const accessToken: Ref<string | undefined> = ref(undefined)
const userInfo: Ref<User | undefined> = ref(undefined)
const idClaims: Ref<IdToken | undefined> = ref(undefined)

AuthService.listen((newState) => {
  isLoading.value = newState.isLoading
  isAuthenticated.value = newState.isAuthenticated
  error.value = newState.error
  accessToken.value = newState.accessToken
  userInfo.value = newState.userInfo
  idClaims.value = newState.idClaims
}, 'useAuthService')

export function useAuthService() {
  return {
    AuthService,
    isLoading,
    isAuthenticated,
    error,
    accessToken,
    userInfo,
    idClaims,
  }
}
