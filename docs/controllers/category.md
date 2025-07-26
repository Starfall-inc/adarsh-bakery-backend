## Category Controller (`src/controllers/category.controller.ts`)

Handles incoming HTTP requests related to categories, orchestrating calls to the `CategoryService` and sending back appropriate responses.

### Methods

*   `getCategories(req, res)`: Handles GET requests to retrieve all categories.
*   `getCategoryBySlug(req, res)`: Handles GET requests to retrieve a category by slug.
*   `createCategory(req, res)`: Handles POST requests to create a new category.
*   `updateCategory(req, res)`: Handles PUT requests to update a category by slug.
*   `deleteCategory(req, res)`: Handles DELETE requests to delete a category by slug.
