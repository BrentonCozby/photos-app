import { I_JsonError, I_JsonErrorDocument } from '@/types'
import { AxiosError } from 'axios'

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
  const errorData: string | I_JsonErrorDocument = axiosError.response?.data || {}

  if (typeof errorData === 'string') {
    return { detail: (error as Error).message }
  }

  return errorData.errors[0]
}
