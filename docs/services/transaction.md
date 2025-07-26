## Transaction Service (`src/services/transaction.service.ts`)

Manages the business logic for payment transactions, including creation and status updates.

### Methods

*   `createTransaction(transactionData: TransactionInput)`: Creates a new transaction record.
*   `getTransactionById(id: string)`: Retrieves a single transaction by its ID.
*   `updateTransactionStatus(id: string, status: string)`: Updates the status of a transaction.
