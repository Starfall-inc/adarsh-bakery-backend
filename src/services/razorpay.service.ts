import { razorpay } from '../config/razorpay.config';
import { serverConfig } from '../config/server.config';
import * as crypto from 'crypto';

export const createOrder = async (amount: number, currency: string, receipt: string) => {
  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency,
    receipt,
  };
  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create Razorpay order');
  }
};

export const verifyPayment = (orderId: string, paymentId: string, signature: string) => {
  const hmac = crypto.createHmac('sha256', serverConfig.razorpay.keySecret);
  hmac.update(orderId + '|' + paymentId);
  const generatedSignature = hmac.digest('hex');

  console.log('Generated Signature:', generatedSignature);
  console.log('Received Signature:', signature);
  console.log('Key Secret:', serverConfig.razorpay.keySecret);

  return generatedSignature === signature;
};
