## Category Service (`src/services/category.service.ts`)

Handles all business logic related to product categories, interacting directly with the `Category` model.

### Methods

*   `getCategories()`: Retrieves all categories.
*   `getCategoryBySlug(slug: string)`: Retrieves a single category by its slug.
*   `createCategory(categoryData: CategoryInput)`: Creates a new category.
*   `updateCategory(slug: string, categoryData: Partial<ICategory>)`: Updates an existing category by slug.
*   `deleteCategory(slug: string)`: Deletes a category by slug.
