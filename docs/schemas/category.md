## Category Schema (`src/schemas/category.schema.ts`)

Defines the validation rules for category data using Zod.

### `categorySchema`

```typescript
export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  images: z.array(z.string().optional()),
  description: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
```

### Purpose

Used to validate incoming category data from API requests.
