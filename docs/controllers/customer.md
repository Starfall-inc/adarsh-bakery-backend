## Customer Controller (`src/controllers/customer.controller.ts`)

Handles incoming HTTP requests related to customer accounts, orchestrating calls to the `CustomerService` and sending back appropriate responses.

### Methods

- `signUp(req, res)`: Handles POST requests for customer registration.
- `login(req, res)`: Handles POST requests for customer login.
- `getCustomers(req, res)`: Handles GET requests to retrieve all customers (admin-level).
- `getCustomerById(req, res)`: Handles GET requests to retrieve a single customer by ID.
- `updateCustomer(req, res)`: Handles PUT requests to update a customer's profile.
- `deleteCustomer(req, res)`: Handles DELETE requests to delete a customer record.
