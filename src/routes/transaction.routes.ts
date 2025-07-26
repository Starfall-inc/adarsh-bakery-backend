
import express from 'express';
import TransactionController from '../controllers/transaction.controller';
import validate from '../middlewares/validate.middleware';
import { createTransactionSchema, getTransactionSchema, updateTransactionStatusSchema } from '../schemas/validate.schema';

const router = express.Router();

router.post('/', validate(createTransactionSchema), TransactionController.createTransaction);
router.get('/:id', validate(getTransactionSchema), TransactionController.getTransactionById);
router.put('/:id/status', validate(updateTransactionStatusSchema), TransactionController.updateTransactionStatus);

export default router;
