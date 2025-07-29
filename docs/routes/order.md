## Order Routes (`src/routes/order.routes.ts`)

Defines the API endpoints for order-related operations. These routes utilize the `OrderController` and `validate` middleware.

### Endpoints

- `POST /api/orders`: Create a new order (requires `createOrderSchema` validation).
- `GET /api/orders`: Get all orders.
- `GET /api/orders/:id`: Get an order by ID.
- `PUT /api/orders/:id/status`: Update an order's status (requires `updateOrderStatusSchema` validation).
- `GET /api/orders/customer/:customerId`: Get orders by customer ID (requires `getOrdersByCustomerIdSchema` validation).
