## Customer Service (`src/services/customer.service.ts`)

Handles all business logic related to customer accounts, including authentication and profile management.

### Methods

*   `signUp(customerData: CustomerInput)`: Registers a new customer and generates a JWT.
*   `login(email: string, password: string)`: Authenticates a customer and generates a JWT upon successful login.
*   `getCustomers()`: Retrieves all customer records (admin-level).
*   `getCustomerById(id: string)`: Retrieves a single customer by their ID.
*   `updateCustomer(id: string, customerData: Partial<CustomerInput>)`: Updates a customer's profile information.
*   `deleteCustomer(id: string)`: Deletes a customer record.
