## Product Schema (`src/schemas/product.schema.ts`)

Defines the validation rules for product data using Zod.

### `productZodSchema`

```typescript
export const productZodSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(3),
  tags: z.array(z.string()).optional(),
  price: z.number().positive(),
  stock: z.number().positive(),
  weight: z.number().positive(),
  images: z.array(z.string()),
  category: z.union([objectIdSchema, categorySchema]), // Can be ObjectId or full Category object
  description: z.string().optional(),
  attributes: z.record(z.string(), z.string()).optional(),
});

export type ProductInput = z.infer<typeof productZodSchema>;
```

### Purpose

Used to validate incoming product data from API requests, ensuring data integrity and correctness before processing.
