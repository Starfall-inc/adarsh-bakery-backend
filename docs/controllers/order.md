## Order Controller (`src/controllers/order.controller.ts`)

Handles incoming HTTP requests related to customer orders, orchestrating calls to the `OrderService` and sending back appropriate responses.

### Methods

- `createOrder(req, res)`: Handles POST requests to create a new order.
- `getOrders(req, res)`: Handles GET requests to retrieve all orders.
- `getOrderById(req, res)`: Handles GET requests to retrieve a single order by ID.
- `updateOrderStatus(req, res)`: Handles PUT requests to update an order's status.
- `getOrdersByCustomerId(req, res)`: Handles GET requests to retrieve orders for a specific customer.
