import { z } from 'zod';
import { productZodSchema } from './product.schema';
import { categorySchema } from './category.schema';
import { customerSchema } from './customer.schema';
import { orderSchema } from './order.schema';
import { transactionSchema } from './transaction.schema';

export const createProductSchema = z.object({
  body: productZodSchema,
});

export const updateProductSchema = z.object({
  body: productZodSchema.partial(),
  params: z.object({
    sku: z.string(),
  }),
});

export const deleteProductSchema = z.object({
  params: z.object({
    sku: z.string(),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    sku: z.string(),
  }),
});

export const createCategorySchema = z.object({
  body: categorySchema,
});

export const updateCategorySchema = z.object({
  body: categorySchema.partial(),
  params: z.object({
    slug: z.string(),
  }),
});

export const deleteCategorySchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

export const getCategorySchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

export const createCustomerSchema = z.object({
  body: customerSchema,
});

export const updateCustomerSchema = z.object({
  body: customerSchema.partial(),
  params: z.object({
    id: z.string(),
  }),
});

export const loginCustomerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const createOrderSchema = z.object({
  body: orderSchema,
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  }),
});

export const getOrderSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const getOrdersByCustomerIdSchema = z.object({
  params: z.object({
    customerId: z.string(),
  }),
});

export const createTransactionSchema = z.object({
  body: transactionSchema,
});

export const getTransactionSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const updateTransactionStatusSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    status: z.enum(['pending', 'successful', 'failed']),
  }),
});
