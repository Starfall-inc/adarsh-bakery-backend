import dotenv from 'dotenv';

// loads the configuration
dotenv.config();

interface ServerConfig {
  port: number;
  mongoURI: string;
  jwtSecret: string;
  nodeEnv: string;

  // minio
  minio: {
    publicKey: string;
    privateKey: string;
    bucketName: string;
    host: string;
    webUrl: string;
  };

  razorpay: {
    keyId: string;
    keySecret: string;
    callbackHookUrl: string;
  };
}

export const serverConfig: ServerConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/adarshbakery',
  jwtSecret: process.env.JWT_TOKEN || 'supersecrettoken',
  nodeEnv: process.env.NODE_ENV || 'development',

  minio: {
    publicKey: process.env.MINIO_PUBLIC_KEY || 'minioadmin',
    privateKey: process.env.MINIO_PRIVATE_KEY || 'minioadmin',
    bucketName: process.env.MINIO_BUCKETNAME || 'adarsh',
    host: process.env.MINIO_HOST || 'https://localhost:5123',
    webUrl: process.env.MINIO_WEB_URL || 'https://cdn.sangonomiya.icu',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'XXXXXXXXXXX',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'XXXXXXXX',
    callbackHookUrl: process.env.RAZORPAY_CALLBACK_URL || 'http://localhost:3000',
  },
};
