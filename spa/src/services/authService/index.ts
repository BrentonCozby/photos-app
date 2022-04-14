import createAuth0Client, { Auth0Client, GenericError } from '@auth0/auth0-spa-js'
import { I_AuthServiceState, T_ListenCb } from './types'
import cloneDeep from 'lodash/cloneDeep'
import { AuthError } from '@/errors'

let auth0: Auth0Client

let state: I_AuthServiceState = {
  isLoading: false,
  isAuthenticated: false,
  error: undefined,
  accessToken: undefined,
  userInfo: undefined,
  idClaims: undefined,
}

/**
 * Initialize the authService by connecting with the auth provider
 */
async function init() {
  let authError: unknown

  auth0 = await createAuth0Client({
    domain: String(import.meta.env.VITE_AUTH0_DOMAIN),
    client_id: String(import.meta.env.VITE_AUTH0_CLIENT_ID),
    redirect_uri: window.location.origin,
    audience: String(import.meta.env.VITE_AUTH0_PHOTOS_API_AUD),
    useRefreshTokens: true,
  }).catch(e => authError = e)

  const search = window.location.search

  if (
    (search.includes('code=') || search.includes('error=')) &&
    search.includes('state=')
  ) {
    const result = await auth0.handleRedirectCallback().catch(e => authError = e)
    // const appState = result?.appState;
    // const target = appState?.target ?? '/';

    window.history.replaceState({}, '', '/')

    // if (router) {
    //   router.push(target);
    // }
  } else {
    await auth0.checkSession().catch(e => authError = e)
  }

  const newState: Partial<I_AuthServiceState> = {}

  newState.isLoading = false

  try {
    const data = await Promise.all([
      await isAuthenticated(),
      await getAccessToken(),
      await getUserInfo(),
      await getIdClaims(),
    ])

    newState.error = undefined
    newState.isAuthenticated = data[0]
    newState.accessToken = data[1]
    newState.userInfo = data[2]
    newState.idClaims = data[3]
  } catch (error) {
    authError = error
  }

  if (authError) {
    newState.error = toAuthError(authError)
  }

  setState(newState)
}

async function getAuth0Client() {
  return auth0
}

function getState() {
  return cloneDeep(state)
}

async function getUserInfo() {
  if (!auth0) {
    return
  }

  return auth0.getUser()
}

async function getAccessToken() {
  if (!auth0) {
    return
  }

  return auth0.getTokenSilently()
}

async function getIdClaims() {
  if (!auth0) {
    return
  }

  return auth0.getIdTokenClaims()
}

async function isAuthenticated() {
  if (!auth0) {
    return false
  }

  return auth0.isAuthenticated()
}

async function login() {
  if (!auth0) {
    return
  }

  setState({ isLoading: true })

  return auth0.loginWithRedirect()
}

async function logout() {
  if (!auth0) {
    return
  }

  setState({ isLoading: true })

  const newState: Partial<I_AuthServiceState> = {}

  let response
  try {
    response = await auth0.logout({ returnTo: window.location.origin })
  } catch (error) {
    newState.error = toAuthError(error)
  }

  newState.isLoading = false
  newState.isAuthenticated = false
  newState.accessToken = undefined
  newState.userInfo = undefined
  newState.idClaims = undefined

  setState(newState)

  return response
}

const listeners: Record<string, T_ListenCb> = {}

function listen(cb: T_ListenCb, id: string) {
  listeners[id] = cb
}

function setState(newState: Partial<I_AuthServiceState>) {
  state = { ...state, ...newState }

  Object.values(listeners).forEach(cb => cb(getState()))
}

function toAuthError(error: unknown) {
  console.error(error)

  if (error instanceof GenericError) {
    return new AuthError({
      message: error.message,
      options: { cause: error },
    })
  } else {
    return error as Error
  }
}

const authService = {
  init,
  getAuth0Client,
  getState,
  getUserInfo,
  getAccessToken,
  getIdClaims,
  isAuthenticated,
  login,
  logout,
  listen,
}

export default authService