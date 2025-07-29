## Order Service (`src/services/order.service.ts`)

Manages the business logic for customer orders, including creation, retrieval, and status updates.

### Methods

- `createOrder(orderData: OrderInput)`: Creates a new order.
- `getOrders()`: Retrieves all orders, populating customer and product details.
- `getOrderById(id: string)`: Retrieves a single order by its ID.
- `updateOrderStatus(id: string, status: string)`: Updates the status of an order.
- `getOrdersByCustomerId(customerId: string)`: Retrieves all orders placed by a specific customer.
