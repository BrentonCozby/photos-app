import sanitizeHtml from 'sanitize-html'

interface IOptions {
  allowedHtmlTags?: string[] | 'all'
}

export const sanitizeText = (text: string, options?: IOptions) => {
  const _options: sanitizeHtml.IOptions = {
    disallowedTagsMode: 'recursiveEscape',
  }

  if (options?.allowedHtmlTags) {
    if (options.allowedHtmlTags === 'all') {
      _options.allowedTags = false
    } else {
      _options.allowedTags = options.allowedHtmlTags
    }
  }

  return sanitizeHtml(text, _options)
}
