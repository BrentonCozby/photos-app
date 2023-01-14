import { IdToken, User } from '@auth0/auth0-spa-js'

export interface I_AuthServiceState {
  isLoading: boolean
  isAuthenticated: boolean
  error?: Error
  accessToken?: string
  userInfo?: User
  idClaims?: IdToken
}

export type T_ListenCb = (state: I_AuthServiceState) => void
