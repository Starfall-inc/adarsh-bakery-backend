import Transaction, { ITransaction } from '../models/transaction.model';
import { TransactionInput } from '../schemas/transaction.schema';
import NotFoundError from '../errors/NotFoundError';

class TransactionService {
  public async createTransaction(transactionData: TransactionInput): Promise<ITransaction> {
    try {
      const transaction = await Transaction.create(transactionData);
      return transaction;
    } catch (error) {
      throw new Error('Failed to create transaction');
    }
  }

  public async getTransactionById(id: string): Promise<ITransaction> {
    try {
      const transaction = await Transaction.findById(id);
      if (!transaction) {
        throw new NotFoundError('Transaction not found');
      }
      return transaction;
    } catch (error) {
      throw new Error('Failed to retrieve transaction');
    }
  }

  public async updateTransactionStatus(
    id: string,
    status: 'pending' | 'successful' | 'failed',
  ): Promise<ITransaction | null> {
    try {
      const transaction = await Transaction.findByIdAndUpdate(id, { status }, { new: true });
      if (!transaction) {
        throw new NotFoundError('Transaction not found');
      }
      return transaction;
    } catch (error) {
      throw new Error('Failed to update transaction status');
    }
  }
}

export default new TransactionService();
