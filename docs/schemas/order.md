## Order Schema (`src/schemas/order.schema.ts`)

Defines the validation rules for order data using Zod.

### `orderItemSchema`

```typescript
export const orderItemSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().min(1),
  price: z.number().min(0),
});
```

### `orderSchema`

```typescript
export const orderSchema = z.object({
  customerId: objectIdSchema,
  items: z.array(orderItemSchema),
  totalAmount: z.number().min(0),
  shippingAddress: z.object({
    address1: z.string(),
    address2: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
  }),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  transactionId: objectIdSchema.optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;
```

### Purpose

Used to validate incoming order data, ensuring all required fields are present and correctly formatted.
