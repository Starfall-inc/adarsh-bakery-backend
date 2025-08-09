import Order, { IOrder } from '../models/order.model';
import { OrderInput } from '../schemas/order.schema';
import NotFoundError from '../errors/NotFoundError';
import Product from '../models/product.model';
import mongoose from 'mongoose';

class OrderService {
  public async createOrder(orderData: OrderInput): Promise<IOrder> {
    try {
      const order = new Order(orderData);

      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Not enough stock for product ${product.name}`);
        }
        product.stock -= item.quantity;
        await product.save();
      }

      await order.save();
      return order;
    } catch (error) {
      console.error("Error in createOrder:", error);
      throw new Error('Failed to create order');
    }
  }

  public async getOrders(): Promise<IOrder[]> {
    try {
      return await Order.find({}).populate('customerId').populate('items.productId');
    } catch (error) {
      throw new Error('Failed to retrieve orders');
    }
  }

  public async getOrderById(id: string): Promise<IOrder> {
    try {
      const order = await Order.findById(id).populate('customerId').populate('items.productId');
      if (!order) {
        throw new NotFoundError('Order not found');
      }
      return order;
    } catch (error) {
      throw new Error('Failed to retrieve order');
    }
  }

  public async updateOrderStatus(
    id: string,
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  ): Promise<IOrder | null> {
    try {
      const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
      if (!order) {
        throw new NotFoundError('Order not found');
      }
      return order;
    } catch (error) {
      throw new Error('Failed to update order status');
    }
  }

  public async updateOrder(
    id: string,
    orderData: Partial<IOrder>,
  ): Promise<IOrder | null> {
    try {
      const order = await Order.findByIdAndUpdate(id, orderData, { new: true });
      if (!order) {
        throw new NotFoundError('Order not found');
      }
      return order;
    } catch (error) {
      throw new Error('Failed to update order');
    }
  }

  public async getOrdersByCustomerId(customerId: string): Promise<IOrder[]> {
    try {
      return await Order.find({ customerId }).populate('items.productId');
    } catch (error) {
      throw new Error('Failed to retrieve orders for customer');
    }
  }
}

export default new OrderService();
