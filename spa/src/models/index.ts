export * from '../../../models'
export * from './photos'

declare module 'axios' {
  export interface AxiosRequestConfig {
    accessToken?: string;
  }
}
