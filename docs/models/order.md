## Order Model (`src/models/order.model.ts`)

Represents a customer's order, including the items purchased, total amount, shipping details, and status.

### Interface (`IOrder`)

```typescript
interface IOrderItem extends Document {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  customerId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  transactionId?: Types.ObjectId; // Reference to the Transaction model
}
```

### Key Fields

*   `customerId`: Reference to the customer who placed the order.
*   `items`: Array of products and their quantities/prices in the order.
*   `totalAmount`: The total cost of the order.
*   `shippingAddress`: Details for shipping the order.
*   `status`: Current status of the order (e.g., pending, shipped).
*   `transactionId`: Optional reference to the associated transaction.

### Relationships

*   `customerId`: Populated from the `Customer` model.
*   `items.productId`: Populated from the `Product` model.
*   `transactionId`: Populated from the `Transaction` model.
