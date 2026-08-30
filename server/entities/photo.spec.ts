import { RequiredError, ValidationError } from '@/errors'

import { makePhoto } from './photo'

const contentHash = '8lkeAK5d1x2'

describe('makePhoto', () => {
  it('returns a frozen photo object', () => {
    'use strict'
    const photo = makePhoto({
      name: 'foo',
      description: 'a photo',
      contentHash,
    })

    // @ts-expect-error "cannot assign name because it is read-only"
    expect(() => photo.name = 'bar').toThrow(TypeError)
  })

  it('must have a description', () => {
    // @ts-expect-error "missing properties"
    expect(() => makePhoto({
      name: 'foo',
      contentHash,
    })).toThrow(new RequiredError({ fieldName: 'description', value: undefined }))
    expect(() => makePhoto({
      name: 'foo',
      description: '   ',
      contentHash,
    })).toThrow(new RequiredError({ fieldName: 'description', value: '   ' }))
  })

  it('must have a name', () => {
    // @ts-expect-error "missing properties"
    expect(() => makePhoto({
      description: 'a photo',
      contentHash,
    })).toThrow(new RequiredError({ fieldName: 'name', value: undefined }))
    expect(() => makePhoto({
      description: 'a photo',
      name: '   ',
      contentHash,
    })).toThrow(new RequiredError({ fieldName: 'name', value: '   ' }))
  })

  it('must have a content hash', () => {
    // @ts-expect-error "missing properties"
    expect(() => makePhoto({
      description: 'a photo',
      name: 'foo',
    })).toThrow(new RequiredError({ fieldName: 'contentHash', value: undefined }))
  })

  it('must have a cuid for an id', () => {
    expect(() => makePhoto({
      description: 'a photo',
      id: 'not-a-cuid',
      name: 'foo',
      contentHash,
    })).toThrow(new ValidationError({ fieldName: 'id', value: 'not-a-cuid', message: 'Must be a cuid' }))
  })

  it('sanitizes the name and description', () => {
    const photo = makePhoto({
      name: '<b onerror="alert(`XSS`">foo</b>',
      description: 'a photo <script src="alert(`foo`)">doSomeEvil()</script>',
      contentHash,
    })

    expect(photo.name).toBe('<b>foo</b>')
    expect(photo.description).toBe('a photo &lt;script&gt;doSomeEvil()&lt;/script&gt;')
  })
})
