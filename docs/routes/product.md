## Product Routes (`src/routes/product.routes.ts`)

Defines the API endpoints for product-related operations. These routes utilize the `ProductController` and `validate` middleware.

### Endpoints

- `GET /api/products`: Get all products.
- `GET /api/products/search/:query`: Search for products.
- `GET /api/products/:sku`: Get a product by SKU.
- `GET /api/products/category/:categorySlug`: Get products by category slug.
- `POST /api/products`: Create a new product (requires `createProductSchema` validation).
- `PUT /api/products/:sku`: Update a product by SKU (requires `updateProductSchema` validation).
- `DELETE /api/products/:sku`: Delete a product by SKU (requires `deleteProductSchema` validation).
