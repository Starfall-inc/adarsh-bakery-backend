import express from 'express';
import OrderController from '../controllers/order.controller';
import validate from '../middlewares/validate.middleware';
import auth from '../middlewares/auth.middleware';
import {
  createOrderSchema,
  getOrderSchema,
  updateOrderStatusSchema,
  getOrdersByCustomerIdSchema,
} from '../schemas/validate.schema';

const router = express.Router();

router.post('/', auth, validate(createOrderSchema), OrderController.createOrder);
router.get('/my-orders', auth, OrderController.getMyOrders);
router.get('/', OrderController.getOrders);
router.get('/:id', validate(getOrderSchema), OrderController.getOrderById);
router.put('/:id/status', validate(updateOrderStatusSchema), OrderController.updateOrderStatus);
router.get('/customer/:customerId', validate(getOrdersByCustomerIdSchema), OrderController.getOrdersByCustomerId);

export default router;
