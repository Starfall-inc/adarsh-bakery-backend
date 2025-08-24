import express from 'express';
import dotenv from 'dotenv';

import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/db';
import { serverConfig } from './config/server.config';
import productRoutes from './routes/product.routes';
import adminProductRoutes from './routes/admin/product.routes';
import categoryRoutes from './routes/category.routes';
import adminCategoryRoutes from './routes/admin/category.routes';
import customerRoutes from './routes/customer.routes';
import orderRoutes from './routes/order.routes';
import adminOrderRoutes from './routes/admin/order.routes';
import transactionRoutes from './routes/transaction.routes';
import adminTransactionRoutes from './routes/admin/transaction.routes';
import adminDashboardRoutes from './routes/admin/dashboard.routes';
import userRoutes from './routes/user.routes';
import logger from './config/logger';
import paymentRoutes from './routes/payment.routes';
import errorHandler from './middlewares/error.middleware';
import bannerRoutes from './routes/banner.routes';
import adminBannerRoutes from './routes/admin/banner.routes';

dotenv.config();

const app = express();
connectDB();

const allowedOrigins = [
  ...(process.env.CLIENT_ORIGIN?.split(',').map((origin) => origin.trim()) || []),
  process.env.ADMIN_PANEL_URL,
].filter(Boolean) as string[];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
});

app.use(morganMiddleware);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Adarsh API version 0.1');
});

app.use('/api/products', productRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin/transactions', adminTransactionRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/admin/banners', adminBannerRoutes);
app.use('/api/payments', paymentRoutes);

app.use(errorHandler);

app.listen(serverConfig.port, '0.0.0.0', () => {
  logger.info(`Server listening on port ${serverConfig.port}`);
});
