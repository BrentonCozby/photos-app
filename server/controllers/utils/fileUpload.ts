import fs from 'fs'
import { isEmpty, isPlainObject, noop } from 'lodash'
import multer from 'multer'

import { ValidationError } from '@/errors'
import { T_ExpressHandler, T_File } from '@/models'

export function fileUpload(args: {
  filename?: string,
  multiple?: boolean,
  fields?: Array<{ name: string, maxCount?: number }>
}) {
  const {
    filename = '',
    multiple = false,
    fields = [],
  } = args

  if (!filename && !fields.length) {
    throw new ValidationError({
      fieldName: 'filename',
      value: filename,
      message: 'Either filename or fields is required.',
    })
  }

  if (filename && fields.length) {
    throw new ValidationError({
      fieldName: 'filename',
      value: filename,
      message: 'Both filename and fields were provided, but only one is allowed.',
    })
  }

  const multerUpload = multer({
    storage: multer.diskStorage({
      destination: '/tmp/uploads',
      filename(req, file, cb) {
        cb(null, `${Math.random().toString()}-${file.originalname}`)
      },
    }),
  })

  const parser: T_ExpressHandler = (function(){
    if (filename) {
      return multiple
        ? multerUpload.array(filename)
        : multerUpload.single(filename)
    }

    return multerUpload.fields(fields)
  })()


  const cleanup: T_ExpressHandler = async (req, res, next) => {
    if (req.file) {
      fs.rm(req.file.path, { force: true }, noop)
    }

    if (req.files) {
      if (Array.isArray(req.files) && req.files.length) {
        req.files.forEach((file) => {
          fs.rm(file.path, { force: true }, noop)
        })
      }

      type T_FileMap = { [fieldName: string]: T_File[] }

      if (isPlainObject(req.files) && !isEmpty(req.files)) {
        Object.values(req.files as T_FileMap).forEach((files) => {
          files.forEach((file) => {
            fs.rm(file.path, { force: true }, noop)
          })
        })
      }
    }

    next()
  }

  return {
    parser,
    cleanup,
  }
}
