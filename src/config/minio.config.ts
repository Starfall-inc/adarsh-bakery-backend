
import dotenv from 'dotenv';

dotenv.config();

export const minioConfig = {
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
  bucket: process.env.MINIO_BUCKET || 'adarsh-bakery-assets',
  publicUrl: process.env.MINIO_PUBLIC_URL || 'http://localhost:9000',
};
