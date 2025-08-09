import Order from '../models/order.model';
import Product from '../models/product.model';
import Customer from '../models/customer.model';
import Transaction from '../models/transaction.model';

class DashboardService {
  public async getDashboardStats() {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    // Example: Sales over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesLast30Days = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: 'delivered' } },
      { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
    ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('customerId').populate('items.productId');

    const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).limit(5);

    return {
      totalProducts,
      totalOrders,
      totalCustomers,
      totalTransactions,
      salesLast30Days: salesLast30Days.length > 0 ? salesLast30Days[0].totalSales : 0,
      recentOrders,
      lowStockProducts,
    };
  }
}

export default new DashboardService();
