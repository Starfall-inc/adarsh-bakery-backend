import { z } from 'zod';
import { categorySchema } from './category.schema';
import { objectIdSchema } from './helper.schema';

export const productZodSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(3),
  tags: z.array(z.string()).optional(),
  price: z.number().positive(),
  stock: z.number().positive(),
  weight: z.number().positive(),
  images: z.array(z.string()),

  category: z.union([objectIdSchema, categorySchema]),
  description: z.string().optional(),
  attributes: z.record(z.string(), z.string()).optional(),
});

export type ProductInput = z.infer<typeof productZodSchema>;
