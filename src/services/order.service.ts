import Order, { IOrder } from '../models/order.model';
import { OrderInput } from '../schemas/order.schema';
import NotFoundError from '../errors/NotFoundError';

class OrderService {
  public async createOrder(orderData: OrderInput): Promise<IOrder> {
    try {
      const order = await Order.create(orderData);
      return order;
    } catch (error) {
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

  public async getOrdersByCustomerId(customerId: string): Promise<IOrder[]> {
    try {
      return await Order.find({ customerId }).populate('items.productId');
    } catch (error) {
      throw new Error('Failed to retrieve orders for customer');
    }
  }
}

export default new OrderService();
