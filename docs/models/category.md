## Category Model (`src/models/category.model.ts`)

Represents a product category. Used to organize products.

### Interface (`ICategory`)

```typescript
interface ICategory extends Document {
  name: string;
  slug: string;
  images: string[];
  description: string;
}
```

### Key Fields

*   `name`: Name of the category.
*   `slug`: URL-friendly unique identifier for the category.
*   `images`: Array of image URLs for the category.
