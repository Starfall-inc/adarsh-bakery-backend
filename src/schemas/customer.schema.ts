import { z } from 'zod';
import { objectIdSchema } from './helper.schema';

export const customerSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  phoneNumber: z.number().optional(),
  shippingAddress: z.string().optional(),
  cart: z
    .array(
      z.object({
        productId: objectIdSchema,
        quantity: z.number().min(1),
      }),
    )
    .optional(),
  wishlist: z.array(objectIdSchema).optional(),
  lastLoginAt: z.date().optional(),
  isActive: z.boolean().optional(),
  orderHistory: z.array(objectIdSchema).optional(),
});

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

export const loginCustomerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string(),
  }),
});

export const addToCartSchema = z.object({
  body: z.object({
    productId: objectIdSchema,
    quantity: z.number().int().min(1),
  }),
});

export const updateCartItemQuantitySchema = z.object({
  body: z.object({
    productId: objectIdSchema,
    quantity: z.number().int().min(0),
  }),
});

export const removeCartItemSchema = z.object({
  params: z.object({
    productId: objectIdSchema,
  }),
});

export const addToWishlistSchema = z.object({
  body: z.object({
    productId: objectIdSchema,
  }),
});

export const removeFromWishlistSchema = z.object({
  params: z.object({
    productId: objectIdSchema,
  }),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>['body'];
export type LoginCustomerInput = z.infer<typeof loginCustomerSchema>['body'];
