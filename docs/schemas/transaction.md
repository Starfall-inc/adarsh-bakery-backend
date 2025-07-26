## Transaction Schema (`src/schemas/transaction.schema.ts`)

Defines the validation rules for transaction data using Zod.

### `transactionSchema`

```typescript
export const transactionSchema = z.object({
  orderId: objectIdSchema,
  transactionId: z.string(),
  paymentGateway: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(['pending', 'successful', 'failed']).optional(),
  rawResponse: z.any().optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
```

### Purpose

Used to validate incoming transaction data, ensuring payment details are correctly structured.
