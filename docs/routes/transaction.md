## Transaction Routes (`src/routes/transaction.routes.ts`)

Defines the API endpoints for transaction-related operations. These routes utilize the `TransactionController` and `validate` middleware.

### Endpoints

*   `POST /api/transactions`: Create a new transaction (requires `createTransactionSchema` validation).
*   `GET /api/transactions/:id`: Get a transaction by ID (requires `getTransactionSchema` validation).
*   `PUT /api/transactions/:id/status`: Update a transaction's status (requires `updateTransactionStatusSchema` validation).
