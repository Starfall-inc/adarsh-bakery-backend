## Validation Schemas (`src/schemas/validate.schema.ts`)

This file consolidates Zod schemas used for validating request bodies, parameters, and queries across different API endpoints. It ensures that incoming data adheres to predefined structures before being processed by controllers.

### Product Validation Schemas

*   `createProductSchema`: Validates the request body for creating a new product.
*   `updateProductSchema`: Validates the request body and parameters for updating an existing product.
*   `deleteProductSchema`: Validates the parameters for deleting a product.
*   `getProductSchema`: Validates the parameters for retrieving a single product.

### Category Validation Schemas

*   `createCategorySchema`: Validates the request body for creating a new category.
*   `updateCategorySchema`: Validates the request body and parameters for updating an existing category.
*   `deleteCategorySchema`: Validates the parameters for deleting a category.
*   `getCategorySchema`: Validates the parameters for retrieving a single category.

### Customer Validation Schemas

*   `createCustomerSchema`: Validates the request body for creating a new customer (signup).
*   `updateCustomerSchema`: Validates the request body and parameters for updating an existing customer.
*   `loginCustomerSchema`: Validates the request body for customer login.

### Order Validation Schemas

*   `createOrderSchema`: Validates the request body for creating a new order.
*   `updateOrderStatusSchema`: Validates the parameters and body for updating an order's status.
*   `getOrderSchema`: Validates the parameters for retrieving a single order.
*   `getOrdersByCustomerIdSchema`: Validates the parameters for retrieving orders by customer ID.

### Transaction Validation Schemas

*   `createTransactionSchema`: Validates the request body for creating a new transaction.
*   `getTransactionSchema`: Validates the parameters for retrieving a single transaction.
*   `updateTransactionStatusSchema`: Validates the parameters and body for updating a transaction's status.
