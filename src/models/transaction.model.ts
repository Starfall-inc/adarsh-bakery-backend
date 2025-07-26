import { Document, Schema, model, Types } from 'mongoose';

export interface ITransaction extends Document {
  orderId: Types.ObjectId;
  transactionId: string; // From payment gateway
  paymentGateway: string;
  amount: number;
  currency: string;
  status: 'pending' | 'successful' | 'failed';
  rawResponse?: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    transactionId: { type: String, required: true, unique: true },
    paymentGateway: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'successful', 'failed'],
      default: 'pending',
    },
    rawResponse: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

const Transaction = model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
