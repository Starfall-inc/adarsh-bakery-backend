import { Document, Schema, model, Types } from 'mongoose';

interface IOrderItem extends Document {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  customerId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  transactionId?: Types.ObjectId;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    // 🔥 FIXED: Changed from Types.ObjectId to Schema.Types.ObjectId
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrder>(
  {
    // 🔥 FIXED: Changed from Types.ObjectId to Schema.Types.ObjectId
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    shippingAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    // 🔥 FIXED: Changed from Types.ObjectId to Schema.Types.ObjectId
    transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
  },
  { timestamps: true },
);

const Order = model<IOrder>('Order', OrderSchema);

export default Order;
