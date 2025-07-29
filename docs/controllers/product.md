## Product Controller (`src/controllers/product.controller.ts`)

Handles incoming HTTP requests related to products, orchestrating calls to the `ProductService` and sending back appropriate responses.

### Methods

- `getProducts(req, res)`: Handles GET requests to retrieve all products.
- `getProductBySku(req, res)`: Handles GET requests to retrieve a product by SKU.
- `getProductsByCategorySlug(req, res)`: Handles GET requests to retrieve products by category slug.
- `searchProducts(req, res)`: Handles GET requests to search for products.
- `createProduct(req, res)`: Handles POST requests to create a new product.
- `updateProduct(req, res)`: Handles PUT requests to update a product by SKU.
- `deleteProduct(req, res)`: Handles DELETE requests to delete a product by SKU.
