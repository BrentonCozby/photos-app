import JSONAPISerializer from 'json-api-serializer'

export const PhotoSerializer = new JSONAPISerializer()
PhotoSerializer.register('photo')
