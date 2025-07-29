import { z } from 'zod';
import { objectIdSchema } from './helper.schema';

export const orderItemSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().min(1),
  price: z.number().min(0),
});

export const orderSchema = z.object({
  customerId: objectIdSchema,
  items: z.array(orderItemSchema),
  totalAmount: z.number().min(0),
  shippingAddress: z.string().min(1, 'Shipping address is required'),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  transactionId: objectIdSchema.optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;
