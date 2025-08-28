// utils/replaceBaseUrl.ts
import { minioConfig } from "../config/minio.config";

export const replaceBaseUrl = (url: string | string[]) => {
  if (Array.isArray(url)) {
    return url.map((img) => img.replace(/^https?:\/\/[^/]+/, minioConfig.publicUrl));
  }
  return (url as string).replace(/^https?:\/\/[^/]+/, minioConfig.publicUrl);
};
