## Customer Schema (`src/schemas/customer.schema.ts`)

Defines the validation rules for customer data using Zod.

### `customerSchema`

```typescript
export const customerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  phoneNumber: z.number().optional(),
  shippingAddresses: z.array(
    z.object({
      address1: z.string(),
      address2: z.string(),
    }),
  ),
  cart: z.array(
    z.object({
      productId: objectIdSchema,
      quantity: z.number().min(1),
    }),
  ),
  lastLoginAt: z.date().optional(),
  isActive: z.boolean().optional(),
  orderHistory: z.array(objectIdSchema),
});

export type CustomerInput = z.infer<typeof customerSchema>;
```

### Purpose

Used to validate incoming customer data for registration, profile updates, and other customer-related operations.
