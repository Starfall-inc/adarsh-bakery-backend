## Category Routes (`src/routes/category.routes.ts`)

Defines the API endpoints for category-related operations. These routes utilize the `CategoryController` and `validate` middleware.

### Endpoints

- `GET /api/categories`: Get all categories.
- `GET /api/categories/:slug`: Get a category by slug.
- `POST /api/categories`: Create a new category (requires `createCategorySchema` validation).
- `PUT /api/categories/:slug`: Update a category by slug (requires `updateCategorySchema` validation).
- `DELETE /api/categories/:slug`: Delete a category by slug (requires `deleteCategorySchema` validation).
