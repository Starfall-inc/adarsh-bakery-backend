
import express from 'express';
import TransactionController from '../../controllers/transaction.controller';
import validate from '../../middlewares/validate.middleware';
import auth from '../../middlewares/user/auth.middleware';
import authorize from '../../middlewares/authorize.middleware';
import { UserRole } from '../../models/user.model';
import {
  createTransactionSchema,
  getTransactionSchema,
  updateTransactionStatusSchema,
} from '../../schemas/validate.schema';

const router = express.Router();

router.post('/', auth, authorize([UserRole.Sales]), validate(createTransactionSchema), TransactionController.createTransaction);
router.get('/:id', auth, authorize([UserRole.Sales]), validate(getTransactionSchema), TransactionController.getTransactionById);
router.put('/:id/status', auth, authorize([UserRole.Sales]), validate(updateTransactionStatusSchema), TransactionController.updateTransactionStatus);

export default router;
