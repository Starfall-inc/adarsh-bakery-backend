import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/db';
import { serverConfig } from './config/server.config';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import customerRoutes from './routes/customer.routes';
import orderRoutes from './routes/order.routes';
import transactionRoutes from './routes/transaction.routes';
import errorHandler from './middlewares/error.middleware';

dotenv.config();

const app = express();
connectDB();
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Adarsh API version 0.1');
});

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
import paymentRoutes from './routes/payment.routes';

app.use('/api/transactions', transactionRoutes);
app.use('/api/payments', paymentRoutes);

app.listen(serverConfig.port, () => {
  console.log('https://localhost:' + serverConfig.port);
});
