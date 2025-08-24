import { Router } from 'express';
import DashboardController from '../../controllers/dashboard.controller';
import auth from '../../middlewares/user/auth.middleware';
import authorize from '../../middlewares/authorize.middleware';
import { UserRole } from '../../models/user.model';

const router = Router();

router.get(
  '/',
  auth,
  authorize([UserRole.Admin, UserRole.Sales, UserRole.ProductManager, UserRole.POS, UserRole.Delivery]),
  DashboardController.getDashboardStats,
);

export default router;
