import { makePhoto } from './photo'
import { RequiredError } from '@/errors'
import { md5 } from '@/utils'

describe('makePhoto', () => {
  it('returns a frozen photo object', () => {
    'use strict'
    const photo = makePhoto({
      name: 'foo',
      description: 'a photo',
      url: 'photourl.com',
    })

    // @ts-expect-error "cannot assign name because it is read-only"
    expect(() => photo.name = 'bar').toThrow(TypeError)
  })

  it('must have a url', () => {
    // @ts-expect-error "missing properties"
    expect(() => makePhoto({
      name: 'foo',
      description: 'a photo',
    })).toThrow(new RequiredError({ fieldName: 'url', value: undefined }))
    expect(() => makePhoto({
      name: 'foo',
      description: 'a photo',
      url: '  ',
    })).toThrow(new RequiredError({ fieldName: 'url', value: '  ' }))
  })

  it('must have a description', () => {
    // @ts-expect-error "missing properties"
    expect(() => makePhoto({
      url: 'photourl.com/1',
      name: 'foo',
    })).toThrow(new RequiredError({ fieldName: 'description', value: undefined }))
    expect(() => makePhoto({
      url: 'photourl.com/1',
      name: 'foo',
      description: '   ',
    })).toThrow(new RequiredError({ fieldName: 'description', value: '   ' }))
  })

  it('must have a name', () => {
    // @ts-expect-error "missing properties"
    expect(() => makePhoto({
      url: 'photourl.com/1',
      description: 'a photo',
    })).toThrow(new RequiredError({ fieldName: 'name', value: undefined }))
    expect(() => makePhoto({
      url: 'photourl.com/1',
      description: 'a photo',
      name: '   ',
    })).toThrow(new RequiredError({ fieldName: 'name', value: '   ' }))
  })

  it('sanitizes the url', () => {
    const photo = makePhoto({
      name: 'foo',
      description: 'a photo',
      url: 'javascript:alert(document.domain)',
    })
    
    expect(photo.url).toBe('about:blank')
  })

  it('sanitizes the name and description', () => {
    const photo = makePhoto({
      name: '<b onerror="alert(`XSS`">foo</b>',
      description: 'a photo <script src="alert(`foo`)">doSomeEvil()</script>',
      url: 'photourl.com',
    })
    
    expect(photo.name).toBe('<b>foo</b>')
    expect(photo.description).toBe('a photo &lt;script&gt;doSomeEvil()&lt;/script&gt;')
  })

  it('creates a contentHash if none is provided', () => {
    const data = { url: 'foo.com/1', description: 'a photo', name: 'foo' }
    expect(makePhoto(data)).toEqual(expect.objectContaining({ contentHash: md5(data.url + data.description) }))
  })
})
