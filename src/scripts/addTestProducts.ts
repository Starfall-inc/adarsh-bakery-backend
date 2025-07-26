import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db';
import Product from '../models/product.model';

const addTestProducts = async () => {
  try {
    await connectDB();
    console.log('Database connected.');

    const products = [
      {
        name: 'Test Product 1',
        description: 'This is a test product 1',
        price: 10.99,
        sku: 'TP001',
        category: 'Test Category',
        imageUrl: 'http://example.com/image1.jpg',
        stock: 100,
      },
      {
        name: 'Test Product 2',
        description: 'This is a test product 2',
        price: 20.50,
        sku: 'TP002',
        category: 'Another Test Category',
        imageUrl: 'http://example.com/image2.jpg',
        stock: 50,
      },
    ];

    await Product.insertMany(products);
    console.log('Test products added successfully!');
  } catch (error) {
    console.error('Error adding test products:', error);
  } finally {
    process.exit();
  }
};

addTestProducts();
