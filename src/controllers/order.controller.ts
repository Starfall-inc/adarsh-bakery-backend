import { Request, Response } from 'express';
import OrderService from '../services/order.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import axios from 'axios';

class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const newOrder = await OrderService.createOrder(req.body);

      // Send ntfy notification
      try {
        const orderLink = `${process.env.ADMIN_PANEL_URL}/orders/${newOrder._id}`;
        const message = `
        New Order Placed! :tada:
        **Order ID:** ${newOrder._id}
        **Total:** ${newOrder.totalAmount}
        [View Order](${orderLink})
        `;

        if (!process.env.NTFY_TOPIC) {
          throw new Error('NTFY_TOPIC environment variable is not defined');
        }
        await axios.post(process.env.NTFY_TOPIC as string, message, {
          headers: {
            Title: 'New Order at Adarsh Bakery',
            Tags: 'tada,cart',
            Markdown: 'yes',
          },
        });
      } catch (error) {
        console.error('Failed to send ntfy notification', error);
      }

      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create order' });
    }
  }

  async getOrders(req: Request, res: Response) {
    try {
      const orders = await OrderService.getOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const order = await OrderService.getOrderById(req.params.id);
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch order ${req.params.id}` });
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const updatedOrder = await OrderService.updateOrderStatus(req.params.id, req.body.status);
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: `Failed to update order status for ${req.params.id}` });
    }
  }

  async updateOrder(req: Request, res: Response) {
    try {
      const updatedOrder = await OrderService.updateOrder(req.params.id, req.body);
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: `Failed to update order ${req.params.id}` });
    }
  }

  async getMyOrders(req: AuthRequest, res: Response) {
    try {
      if (!req.customer) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      const orders = await OrderService.getOrdersByCustomerId(req.customer.id);
      res.status(200).json({ orders });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch orders' });
    }
  }

  async getOrdersByCustomerId(req: Request, res: Response) {
    try {
      const orders = await OrderService.getOrdersByCustomerId(req.params.customerId);
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch orders for customer ${req.params.customerId}` });
    }
  }
}

export default new OrderController();
