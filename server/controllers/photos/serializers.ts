import JSONAPISerializer from 'json-api-serializer'

const PhotoSerializer = new JSONAPISerializer()

PhotoSerializer.register('photo')

export {
  PhotoSerializer,
}
