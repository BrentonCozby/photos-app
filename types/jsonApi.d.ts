/**
 * https://jsonapi.org/format/
 *
 * For xhr responses
 */


/**
 * The base data structure for a JSON api response
 * @see https://jsonapi.org/format/#document-structure
 */
export interface I_JsonDocument {
  data?: I_JsonResource | I_JsonResource[]
  errors?: I_JsonError[]
  meta?: I_JsonMeta
  jsonapi?: {
    version?: string
    meta?: I_JsonMeta
  }
  links?: I_JsonLinks
  included?: I_JsonResource[]
}


/**
 * Contains a list of errors
 */
export interface I_JsonErrorDocument extends I_JsonDocument {
  errors: I_JsonError[],
}


/**
 * A resource object
 * @see https://jsonapi.org/format/#document-resource-objects
 */
export interface I_JsonResource {
  id?: string
  type: string
  attributes?: I_JsonAttributes
  relationships?: I_JsonRelationships
  links?: I_JsonLinks
  meta?: I_JsonMeta
}


/**
 * An error object
 * @see https://jsonapi.org/format/#error-objects
 * @see https://jsonapi.org/examples/#error-objects
 */
export interface I_JsonError {
  id?: string
  links?: I_JsonLinks
  status?: string
  code?: string
  title?: string
  detail?: string
  source?: {
    pointer?: string
    parameter?: string
  }
  meta?: I_JsonMeta
}


/**
 * An attributes object
 * @see https://jsonapi.org/format/#document-resource-object-attributes
 */
export interface I_JsonAttributes<T = unknown> {
  [key: string]: Partial<T>
}


/**
 * A relationships object
 * @see https://jsonapi.org/format/#document-resource-object-relationships
 */
export interface I_JsonRelationships {
  links?: I_JsonLinks
  data?: I_JsonResource
  meta?: I_JsonMeta
}


/**
 * A links object
 * @see https://jsonapi.org/format/#document-links
 */
export interface I_JsonLinks {
  self?: string
  related?: {
    href: string
    meta: I_JsonMeta
  }
}


/**
 * A meta object
 * @see https://jsonapi.org/format/#document-meta
 */
export interface I_JsonMeta<T = any> {
  [key: string]: T
}

