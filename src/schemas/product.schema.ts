import { z } from 'zod';
import { categorySchema } from './category.schema';
import { objectIdSchema } from './helper.schema';

export const productZodSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(3),
  tags: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',').map((tag) => tag.trim()) : undefined)),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().nonnegative(),
  weight: z.coerce.number().positive().optional(),
  images: z.array(z.string()).optional(),

  category: z.union([objectIdSchema, categorySchema]),
  description: z.string().optional(),
  attributes: z.record(z.string(), z.string()).optional(),
  dietary: z.enum(['veg', 'non-veg', 'none']).optional(),
});

export type ProductInput = z.infer<typeof productZodSchema>;
