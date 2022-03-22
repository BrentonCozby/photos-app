export * from '../../../types'

declare module 'axios' {
  export interface AxiosRequestConfig {
    accessToken?: string;
  }
}
