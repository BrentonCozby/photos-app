import { RequiredError, ValidationError } from '@/errors'

import { makePhoto } from './photo'

const validArgs = {
  contentHash: '8lkeAK5d1x2',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  description: 'a photo',
  id: 'ctest0000000000000000001',
  name: 'foo',
  updatedAt: new Date('2023-01-02T00:00:00.000Z'),
}

describe('makePhoto', () => {
  it('returns a frozen photo object', () => {
    'use strict'
    const photo = makePhoto(validArgs)

    // @ts-expect-error "cannot assign name because it is read-only"
    expect(() => photo.name = 'bar').toThrow(TypeError)
  })

  it('returns the same photo for the same inputs', () => {
    expect(makePhoto(validArgs)).toEqual(makePhoto(validArgs))
  })

  it('must have a description', () => {
    expect(() => makePhoto({ ...validArgs, description: '' }))
      .toThrow(new RequiredError({ fieldName: 'description', value: '' }))
    expect(() => makePhoto({ ...validArgs, description: '   ' }))
      .toThrow(new RequiredError({ fieldName: 'description', value: '   ' }))
  })

  it('must have a name', () => {
    expect(() => makePhoto({ ...validArgs, name: '' }))
      .toThrow(new RequiredError({ fieldName: 'name', value: '' }))
    expect(() => makePhoto({ ...validArgs, name: '   ' }))
      .toThrow(new RequiredError({ fieldName: 'name', value: '   ' }))
  })

  it('must have a content hash', () => {
    expect(() => makePhoto({ ...validArgs, contentHash: '' }))
      .toThrow(new RequiredError({ fieldName: 'contentHash', value: '' }))
  })

  it('must have both timestamps', () => {
    expect(() => makePhoto({ ...validArgs, createdAt: '' }))
      .toThrow(new RequiredError({ fieldName: 'createdAt', value: '' }))
    expect(() => makePhoto({ ...validArgs, updatedAt: '' }))
      .toThrow(new RequiredError({ fieldName: 'updatedAt', value: '' }))
  })

  it('must have a cuid for an id', () => {
    expect(() => makePhoto({ ...validArgs, id: '' }))
      .toThrow(new RequiredError({ fieldName: 'id', value: '' }))
    expect(() => makePhoto({ ...validArgs, id: 'not-a-cuid' }))
      .toThrow(new ValidationError({ fieldName: 'id', value: 'not-a-cuid', message: 'Must be a cuid' }))
  })

  it('sanitizes the name and description', () => {
    const photo = makePhoto({
      ...validArgs,
      name: '<b onerror="alert(`XSS`">foo</b>',
      description: 'a photo <script src="alert(`foo`)">doSomeEvil()</script>',
    })

    expect(photo.name).toBe('<b>foo</b>')
    expect(photo.description).toBe('a photo &lt;script&gt;doSomeEvil()&lt;/script&gt;')
  })
})
