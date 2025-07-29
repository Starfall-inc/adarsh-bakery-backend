import { Request, Response } from 'express';
import TransactionService from '../services/transaction.service';

class TransactionController {
  async createTransaction(req: Request, res: Response) {
    try {
      const newTransaction = await TransactionService.createTransaction(req.body);
      res.status(201).json(newTransaction);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create transaction' });
    }
  }

  async getTransactionById(req: Request, res: Response) {
    try {
      const transaction = await TransactionService.getTransactionById(req.params.id);
      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch transaction ${req.params.id}` });
    }
  }

  async updateTransactionStatus(req: Request, res: Response) {
    try {
      const updatedTransaction = await TransactionService.updateTransactionStatus(req.params.id, req.body.status);
      res.status(200).json(updatedTransaction);
    } catch (error) {
      res.status(500).json({ message: `Failed to update transaction status for ${req.params.id}` });
    }
  }
}

export default new TransactionController();
