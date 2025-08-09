import express from 'express';
import OrderController from '../../controllers/order.controller';
import validate from '../../middlewares/validate.middleware';
import auth from '../../middlewares/user/auth.middleware';
import authorize from '../../middlewares/authorize.middleware';
import { UserRole } from '../../models/user.model';
import {
  createOrderSchema,
  getOrderSchema,
  updateOrderStatusSchema,
  getOrdersByCustomerIdSchema,
} from '../../schemas/validate.schema';

const router = express.Router();

router.get('/', auth, authorize([UserRole.POS, UserRole.Sales, UserRole.Delivery]), OrderController.getOrders);
router.get(
  '/:id',
  auth,
  authorize([UserRole.POS, UserRole.Sales, UserRole.Delivery, UserRole.Admin]),
  validate(getOrderSchema),
  OrderController.getOrderById,
);
router.put(
  '/:id',
  auth,
  authorize([UserRole.POS, UserRole.Sales, UserRole.Admin]),
  validate(createOrderSchema), // Reusing createOrderSchema for validation, adjust if needed
  OrderController.updateOrder,
);
router.put(
  '/:id/status',
  auth,
  authorize([UserRole.Delivery, UserRole.Admin]),
  validate(updateOrderStatusSchema),
  OrderController.updateOrderStatus,
);
router.get(
  '/customer/:customerId',
  auth,
  authorize([UserRole.POS, UserRole.Sales, UserRole.Delivery, UserRole.Admin]),
  validate(getOrdersByCustomerIdSchema),
  OrderController.getOrdersByCustomerId,
);

export default router;
