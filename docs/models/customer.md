## Customer Model (`src/models/customer.model.ts`)

Represents a customer account in the system. Includes authentication details, personal information, and shopping-related data.

### Interface (`ICustomer`)

```typescript
interface ICartItem extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: number;
  shippingAddresses: {
    address1: string;
    address2: string;
  }[];
  cart: ICartItem[];
  lastLoginAt?: Date;
  isActive: boolean;
  orderHistory: mongoose.Types.ObjectId[]; // Array of Order IDs
  comparePassword(candidatePassword: string): Promise<boolean>;
}
```

### Key Fields

*   `email`: Unique email address for login.
*   `password`: Hashed password for authentication.
*   `firstName`, `lastName`: Customer's personal details.
*   `shippingAddresses`: Array of addresses for shipping.
*   `cart`: Array of items currently in the customer's shopping cart.
*   `orderHistory`: References to past orders placed by the customer.

### Methods

*   `comparePassword(candidatePassword: string)`: Compares a given password with the stored hashed password.

### Pre-save Hooks

*   Has a `pre('save')` hook to hash the password before saving if it's modified.
