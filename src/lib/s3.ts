import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION || !process.env.AWS_S3_BUCKET) {
  throw new Error('Missing required AWS credentials in environment variables');
}

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function createPresignedUploadUrl(key: string) {
  try {
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Conditions: [
        ['content-length-range', 0, 10485760], // up to 10MB
        ['starts-with', '$Content-Type', 'application/pdf'],
      ],
      Expires: 600, // 10 minutes
    });

    return { url, fields };
  } catch (error) {
    console.error('Error creating presigned URL:', error);
    throw error;
  }
}

export function getS3FileUrl(key: string): string {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
