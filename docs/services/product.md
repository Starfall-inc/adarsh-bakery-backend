## Product Service (`src/services/product.service.ts`)

Handles all business logic related to products, interacting directly with the `Product` and `Category` models.

### Methods

- `getProducts()`: Retrieves all products, populating category details.
- `getProductBySku(sku: string)`: Retrieves a single product by its SKU.
- `getProductsByCategorySlug(categorySlug: string)`: Retrieves products belonging to a specific category slug.
- `searchProducts(query: string)`: Searches for products by name, tags, or description.
- `createProduct(productData: ProductInput)`: Creates a new product.
- `updateProduct(sku: string, productData: Partial<IProduct>)`: Updates an existing product by SKU.
- `deleteProduct(sku: string)`: Deletes a product by SKU.
