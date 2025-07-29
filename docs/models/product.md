## Product Model (`src/models/product.model.ts`)

Represents a product in the bakery. Stores details such as SKU, name, price, stock, and category.

### Interface (`IProduct`)

```typescript
interface IProduct extends Document {
  sku: string;
  name: string;
  tags?: string[];
  price: number;
  stock: number;
  weight: number;
  images: string[];
  category: Types.ObjectId | ICategory; // Reference to Category model
  description?: string;
  attributes?: Record<string, string>;
}
```

### Key Fields

- `sku`: Unique identifier for the product.
- `name`: Name of the product.
- `price`: Price of the product.
- `stock`: Available stock quantity.
- `category`: Reference to the associated category.

### Relationships

- `category`: Populated from the `Category` model.
