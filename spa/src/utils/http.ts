import { AxiosError } from 'axios'

import { I_JsonError, I_JsonErrorDocument } from '@/models'

export function isAxiosError(error: unknown): boolean {
  if (error instanceof Error) {
    return (error as AxiosError).isAxiosError
  }

  return false
}

export function getAxiosErrorData(error: unknown): I_JsonError {
  if (!isAxiosError(error)) {
    return { detail: (error as Error)?.message }
  }

  const axiosError = error as AxiosError
  const errorData: unknown | string | I_JsonErrorDocument = axiosError.response?.data || {}

  if (typeof errorData === 'string') {
    return { detail: (error as Error).message }
  }

  if (errorData instanceof Object && errorData.hasOwnProperty('errors')) {
    return (errorData as I_JsonErrorDocument).errors[0]
  }

  return { detail: JSON.stringify(errorData) }
}
