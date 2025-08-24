import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
