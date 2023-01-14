import fs from 'fs'

import { RequiredError } from '@/errors'

import { makePhoto } from './photo'

describe('makePhoto', () => {
  let testPhoto: Buffer

  beforeEach(() => {
    testPhoto = fs.readFileSync('./entities/test-photo.jpg')
  })

  it('returns a frozen photo object', async () => {
    'use strict'
    const photo = await makePhoto({
      name: 'foo',
      description: 'a photo',
      fileBuffer: testPhoto,
    })

    // @ts-expect-error "cannot assign name because it is read-only"
    expect(() => photo.name = 'bar').toThrow(TypeError)
  })

  it('must have a description', async () => {
    // @ts-expect-error "missing properties"
    await expect(() => makePhoto({
      name: 'foo',
      fileBuffer: testPhoto,
    })).rejects.toThrow(new RequiredError({ fieldName: 'description', value: undefined }))
    await expect(() => makePhoto({
      name: 'foo',
      description: '   ',
    })).rejects.toThrow(new RequiredError({ fieldName: 'description', value: '   ' }))
  })

  it('must have a name', async () => {
    // @ts-expect-error "missing properties"
    await expect(() => makePhoto({
      description: 'a photo',
      fileBuffer: testPhoto,
    })).rejects.toThrow(new RequiredError({ fieldName: 'name', value: undefined }))
    await expect(() => makePhoto({
      description: 'a photo',
      name: '   ',
    })).rejects.toThrow(new RequiredError({ fieldName: 'name', value: '   ' }))
  })

  it('sanitizes the name and description', async () => {
    const photo = await makePhoto({
      name: '<b onerror="alert(`XSS`">foo</b>',
      description: 'a photo <script src="alert(`foo`)">doSomeEvil()</script>',
      fileBuffer: testPhoto,
    })

    expect(photo.name).toBe('<b>foo</b>')
    expect(photo.description).toBe('a photo &lt;script&gt;doSomeEvil()&lt;/script&gt;')
  })
})
