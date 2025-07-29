import { Request, Response } from 'express';
import { createOrder, verifyPayment } from '../services/razorpay.service';
import orderService from '../services/order.service';
import transactionService from '../services/transaction.service';
import { Types } from 'mongoose';

export const createRazorpayOrder = async (req: Request, res: Response) => {
  const { amount, currency, receipt } = req.body;
  try {
    const order = await createOrder(amount, currency, receipt);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  const { order_id, payment_id, signature, orderData } = req.body;
  const isValid = verifyPayment(order_id, payment_id, signature);
  if (isValid) {
    try {
      const newOrder = await orderService.createOrder(orderData);
      const transactionData = {
        orderId: (newOrder._id as Types.ObjectId).toString(),
        transactionId: payment_id,
        paymentGateway: 'Razorpay',
        amount: newOrder.totalAmount,
        currency: 'INR',
        status: 'successful' as const,
        rawResponse: req.body,
      };
      const newTransaction = await transactionService.createTransaction(transactionData);
      res.json({ status: 'success', order: newOrder, transaction: newTransaction });
    } catch (error: any) {
      console.error('Error creating order or transaction:', error);
      res.status(500).json({ error: error.message || 'Failed to process payment verification' });
    }
  } else {
    res.status(400).json({ status: 'failure' });
  }
};
