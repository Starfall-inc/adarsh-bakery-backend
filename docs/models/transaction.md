## Transaction Model (`src/models/transaction.model.ts`)

Represents a financial transaction associated with an order. This separates payment details from the order itself.

### Interface (`ITransaction`)

```typescript
export interface ITransaction extends Document {
  orderId: Types.ObjectId;
  transactionId: string; // From payment gateway
  paymentGateway: string;
  amount: number;
  currency: string;
  status: 'pending' | 'successful' | 'failed';
  rawResponse?: any;
}
```

### Key Fields

*   `orderId`: Reference to the associated order.
*   `transactionId`: Unique ID provided by the payment gateway.
*   `paymentGateway`: Name of the payment gateway used (e.g., "Razorpay").
*   `amount`: Amount of the transaction.
*   `currency`: Currency of the transaction.
*   `status`: Current status of the transaction (pending, successful, failed).
*   `rawResponse`: Raw response data from the payment gateway.

### Relationships

*   `orderId`: Populated from the `Order` model.
