## Transaction Controller (`src/controllers/transaction.controller.ts`)

Handles incoming HTTP requests related to payment transactions, orchestrating calls to the `TransactionService` and sending back appropriate responses.

### Methods

- `createTransaction(req, res)`: Handles POST requests to create a new transaction record.
- `getTransactionById(req, res)`: Handles GET requests to retrieve a single transaction by ID.
- `updateTransactionStatus(req, res)`: Handles PUT requests to update a transaction's status.
