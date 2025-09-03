import * as Minio from 'minio';
import { minioConfig } from '../config/minio.config';

class MinioService {
  private minioClient: Minio.Client;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: minioConfig.endPoint,
      port: minioConfig.port,
      useSSL: false,
      accessKey: minioConfig.accessKey,
      secretKey: minioConfig.secretKey,
    });
  }

  public async ensureBucketExists(bucketName: string): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(bucketName, "us-east-1");
        console.log(`✅ Bucket "${bucketName}" created successfully`);
      } else {
        console.log(`ℹ️ Bucket "${bucketName}" already exists`);
      }

      // Apply read-only policy
      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucketName}/*`],
          },
        ],
      };

      await this.minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
      console.log(`🔓 Read-only policy applied to bucket "${bucketName}"`);

    } catch (error) {
      console.error("❌ Error ensuring bucket:", error);
      throw new Error("Failed to ensure bucket");
    }
  }


  public async uploadFile(bucketName: string, objectName: string, filePath: string): Promise<string> {
    try {
      await this.minioClient.fPutObject(bucketName, objectName, filePath, {});
      const url = `${minioConfig.publicUrl}/${bucketName}/${objectName}`;
      return url;
    } catch (error) {
      console.error('Error uploading file to MinIO:', error);
      throw new Error('Failed to upload file to MinIO');
    }
  }

  public async uploadBuffer(bucketName: string, objectName: string, buffer: Buffer): Promise<string> {
    try {
      await this.minioClient.putObject(bucketName, objectName, buffer, buffer.length);
      const url = `${minioConfig.publicUrl}/${bucketName}/${objectName}`;
      return url;
    } catch (error) {
      console.error('Error uploading file to MinIO:', error);
      throw new Error('Failed to upload file to MinIO');
    }
  }

  public async deleteObject(bucketName: string, objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(bucketName, objectName);
    } catch (error) {
      console.error('Error deleting object from MinIO:', error);
      throw new Error('Failed to delete object from MinIO');
    }
  }

  public get client(): Minio.Client {
    return this.minioClient;
  }
}

export default new MinioService();
