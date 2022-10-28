import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3'
import { MAIN_BUCKET } from '@/constants'
import { RequiredError } from '@/errors'

let client: S3Client

export function getClient() {
  if (!client) {
    client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
      },
      region: process.env.AWS_S3_REGION || '',
    })
  }

  return client
}

export async function upload(args: {
  filePath: string
  content: Buffer
  mimeType: string
}) {
  const { filePath, content, mimeType } = args

  const command = new PutObjectCommand({
    Bucket: MAIN_BUCKET,
    Key: filePath,
    Body: content,
    ContentType: mimeType,
  })

  return getClient().send(command)
}

export async function getObject(args: {
  key: string
}) {
  const {
    key,
  } = args

  const command = new GetObjectCommand({
    Bucket: MAIN_BUCKET,
    Key: key,
  })

  return getClient().send(command)
}

export async function deleteObjects(args: {
  keys: string[]
}) {
  const { keys } = args

  if (!keys.length) {
    throw new RequiredError({ fieldName: 'keys', value: keys })
  }

  const command = new DeleteObjectsCommand({
    Bucket: MAIN_BUCKET,
    Delete: {
      Objects: keys.map((key) => ({ Key: key })),
    },
  })

  return await getClient().send(command)
}

export default {
  deleteObjects,
  getClient,
  getObject,
  upload,
}
