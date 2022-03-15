import { sanitizeUrl as braintreeSanitizeUrl } from '@braintree/sanitize-url'

export const sanitizeUrl = (url: string) => {
  return braintreeSanitizeUrl(url)
}
