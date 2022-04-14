import { I_JsonError, I_JsonErrorDocument } from '@/types'
import { AxiosError } from 'axios'

export function isAxiosError(error: unknown): boolean {
  if (error instanceof Error) {
    return (error as AxiosError).isAxiosError
  }

  return false
}

export function getAxiosErrorData(error: unknown): I_JsonError | undefined {
  if (!isAxiosError(error)) {
    return
  }

  const axiosError = error as AxiosError
  const errorData: I_JsonErrorDocument = axiosError.response?.data || {}

  return errorData.errors[0]
}
