import { z } from 'zod';
import { productZodSchema } from './product.schema';
import { categorySchema } from './category.schema';

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

export const createCategorySchema = z.object({
  body: categorySchema,
});

export const updateCategorySchema = z.object({
  body: categorySchema.partial(),
  params: z.object({
    slug: z.string(),
  }),
});

export const deleteCategorySchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

export const getCategorySchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});
