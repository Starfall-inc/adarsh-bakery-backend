
import { z } from 'zod';
import { productZodSchema } from './product.schema';

export const createProductSchema = z.object({
  body: productZodSchema,
});

export const updateProductSchema = z.object({
  body: productZodSchema.partial(),
  params: z.object({
    sku: z.string(),
  }),
});

export const deleteProductSchema = z.object({
  params: z.object({
    sku: z.string(),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    sku: z.string(),
  }),
});
