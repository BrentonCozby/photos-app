import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { MAIN_BUCKET } from '@/constants'

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

export default {
  getClient,
  getObject,
  upload,
}
