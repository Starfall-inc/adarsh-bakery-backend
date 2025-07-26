
import { z } from 'zod';
import { objectIdSchema } from './helper.schema';

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
