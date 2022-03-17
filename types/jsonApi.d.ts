/**
 * https://jsonapi.org/format/
 *
 * For xhr responses
 */


/**
 * The base data structure for a JSON api response
 * @see https://jsonapi.org/format/#document-structure
 */
export interface IJsonDocument {
  data?: IJsonResource | IJsonResource[]
  errors?: IJsonError[]
  meta?: IJsonMeta
  jsonapi?: {
    version?: string
    meta?: IJsonMeta
  }
  links?: IJsonLinks
  included?: IJsonResource[]
}


/**
 * Contains a list of errors
 */
export interface IJsonErrorDocument extends IJsonDocument {
  errors: IJsonError[],
}


/**
 * A resource object
 * @see https://jsonapi.org/format/#document-resource-objects
 */
export interface IJsonResource {
  id?: string
  type: string
  attributes?: IJsonAttributes
  relationships?: IJsonRelationships
  links?: IJsonLinks
  meta?: IJsonMeta
}


/**
 * An error object
 * @see https://jsonapi.org/format/#error-objects
 * @see https://jsonapi.org/examples/#error-objects
 */
export interface IJsonError {
  id?: string
  links?: IJsonLinks
  status?: string
  code?: string
  title?: string
  detail?: string
  source?: {
    pointer?: string
    parameter?: string
  }
  meta?: IJsonMeta
}


/**
 * An attributes object
 * @see https://jsonapi.org/format/#document-resource-object-attributes
 */
export interface IJsonAttributes<T = unknown> {
  [key: string]: Partial<T>
}


/**
 * A relationships object
 * @see https://jsonapi.org/format/#document-resource-object-relationships
 */
export interface IJsonRelationships {
  links?: IJsonLinks
  data?: IJsonResource
  meta?: IJsonMeta
}


/**
 * A links object
 * @see https://jsonapi.org/format/#document-links
 */
export interface IJsonLinks {
  self?: string
  related?: {
    href: string
    meta: IJsonMeta
  }
}


/**
 * A meta object
 * @see https://jsonapi.org/format/#document-meta
 */
export interface IJsonMeta<T = unknown> {
  [key: string]: Partial<T>
}

