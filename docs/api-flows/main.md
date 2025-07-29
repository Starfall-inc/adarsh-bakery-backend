## API Flows

This section describes the typical interaction flows for key features of the Adarsh Bakery backend API.

### Order Creation and Transaction Flow

This flow outlines how a customer places an order and how the associated payment transaction is handled.

1.  **Customer Places an Order (Frontend to Backend)**
    - **Request:** `POST /api/orders`
    - **Body:** Contains `customerId`, `items` (productId, quantity, price), `shippingAddress`.
    - **Validation:** `validate(createOrderSchema)` ensures data integrity.
    - **Controller:** `OrderController.createOrder` calls `OrderService.createOrder`.
    - **Service:** `OrderService.createOrder` saves the order to the database with a `pending` status.
    - **Response:** `201 Created` with the new order details.

2.  **Initiate Payment/Transaction (Frontend/Backend to Backend)**
    - **Request:** `POST /api/transactions` (This is a conceptual endpoint for initiating payment, actual implementation might vary based on payment gateway integration).
    - **Body:** Contains `orderId`, `amount`, `currency`, `paymentGateway`, `transactionId` (from your system or gateway).
    - **Validation:** `validate(createTransactionSchema)`.
    - **Controller:** `TransactionController.createTransaction` calls `TransactionService.createTransaction`.
    - **Service:** `TransactionService.createTransaction` saves the transaction record with a `pending` status.
    - **Response:** `201 Created` with the new transaction details.

3.  **Payment Gateway Interaction (Backend to External Payment Gateway)**
    - Your backend communicates with an external payment gateway (e.g., Razorpay) using its SDK or API.
    - The payment gateway processes the payment.

4.  **Payment Gateway Callback/Webhook (External Payment Gateway to Backend)**
    - The payment gateway sends a callback (webhook) to a predefined endpoint on your backend.
    - **Request:** `PUT /api/transactions/:id/status` (or a dedicated webhook endpoint).
    - **Body:** Contains the final `status` of the payment (e.g., `successful`, `failed`) and potentially other payment gateway specific data.
    - **Validation:** `validate(updateTransactionStatusSchema)`.
    - **Controller:** `TransactionController.updateTransactionStatus` calls `TransactionService.updateTransactionStatus`.
    - **Service:** `TransactionService.updateTransactionStatus` updates the transaction record in your database.

5.  **Update Order Status (Internal Logic/Backend to Backend)**
    - Upon a successful transaction, the order's status needs to be updated.
    - This can be triggered:
      - Directly within `TransactionService` after a successful transaction update.
      - By a separate background job or message queue listener.
      - By a subsequent API call from the frontend to `PUT /api/orders/:id/status`.
    - **Controller:** `OrderController.updateOrderStatus` calls `OrderService.updateOrderStatus`.
    - **Service:** `OrderService.updateOrderStatus` updates the order's status (e.g., from `pending` to `processing` or `shipped`).

### Customer Authentication Flow

This flow describes how customers register and log in to the system.

1.  **Customer Signup**
    - **Request:** `POST /api/customers/signup`
    - **Body:** Contains `firstName`, `lastName`, `email`, `password`, etc.
    - **Validation:** `validate(createCustomerSchema)`.
    - **Controller:** `CustomerController.signUp` calls `CustomerService.signUp`.
    - **Service:** `CustomerService.signUp` hashes the password, creates the customer record, and generates a JWT.
    - **Response:** `201 Created` with the new customer details and the JWT.

2.  **Customer Login**
    - **Request:** `POST /api/customers/login`
    - **Body:** Contains `email` and `password`.
    - **Validation:** `validate(loginCustomerSchema)`.
    - **Controller:** `CustomerController.login` calls `CustomerService.login`.
    - **Service:** `CustomerService.login` verifies credentials, updates `lastLoginAt`, and generates a JWT.
    - **Response:** `200 OK` with customer details and the JWT, or `401 Unauthorized` for invalid credentials.
