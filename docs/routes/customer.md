## Customer Routes (`src/routes/customer.routes.ts`)

Defines the API endpoints for customer-related operations, including authentication and profile management. These routes utilize the `CustomerController` and `validate` middleware.

### Endpoints

*   `POST /api/customers/signup`: Register a new customer (requires `createCustomerSchema` validation).
*   `POST /api/customers/login`: Authenticate a customer (requires `loginCustomerSchema` validation).
*   `GET /api/customers`: Get all customers (admin-level).
*   `GET /api/customers/:id`: Get a customer by ID.
*   `PUT /api/customers/:id`: Update a customer's profile (requires `updateCustomerSchema` validation).
*   `DELETE /api/customers/:id`: Delete a customer by ID.
