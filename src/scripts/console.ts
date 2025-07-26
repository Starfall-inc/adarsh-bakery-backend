#!/usr/bin/env ts-node

import { serverConfig } from '../config/server.config';

import mongoose from 'mongoose';
import chalk from 'chalk';
import inquirer from 'inquirer';
import Table from 'cli-table3';

// --- Import your models --- update paths if needed:
import Product from '../models/product.model';
import Category from '../models/category.model';
import Customer from '../models/customer.model';
import Order from '../models/order.model';
import Transaction from '../models/transaction.model';

// --- Ensure mandatory env vars ---
const MONGO_URI = serverConfig.mongoURI;

// --- Connect to MongoDB ---
async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState > 0) return;
  await mongoose.connect(MONGO_URI);
}

// --- Utility functions ---
const divider = chalk.gray('═'.repeat(process.stdout.columns || 60));

const success = (msg: string): void => console.log(chalk.green.bold('✅  ' + msg));
const error = (msg: string): void => console.log(chalk.red.bold('❌  ' + msg));
const info = (msg: string): void => console.log(chalk.blue.bold('ℹ️  ' + msg));
const warn = (msg: string): void => console.log(chalk.yellow.bold('⚠️  ' + msg));

function showTitle(title: string): void {
  console.clear();
  const width = process.stdout.columns || 60;
  console.log(chalk.cyan.bold('\n' + '═'.repeat(width)));
  console.log(chalk.cyan.bold(`                 ${title}`));
  console.log(chalk.cyan.bold('═'.repeat(width) + '\n'));
}

/** Print neatly a table to the console */
function printTable(header: string[], rows: (string | number)[][]): void {
  if (rows.length === 0) {
    warn('No data to display.');
    return;
  }
  const table = new Table({
    head: header,
    style: { head: ['cyan', 'bold'] },
    wordWrap: true,
    colWidths: header.map(() => 25),
  });
  rows.forEach((row: (string | number)[]) => table.push(row));
  console.log(table.toString());
}

/** Safely extract error message */
function getErrorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

// --- Application logic starts here ---

async function main(): Promise<void> {
  await connectDB();
  info('Connected to MongoDB.\n');

  mainLoop: while (true) {
    const { module } = await inquirer.prompt<{ module: string }>({
      type: 'list',
      name: 'module',
      message: chalk.magentaBright.bold('What would you like to do?'),
      choices: [
        { name: '🛒 Manage Products', value: 'products' },
        { name: '📂 Manage Categories', value: 'categories' },
        { name: '👤 Manage Customers', value: 'customers' },
        { name: '📦 Manage Orders', value: 'orders' },
        { name: '💸 Manage Transactions', value: 'transactions' },
        new inquirer.Separator(),
        { name: chalk.bold.red('🚪 Exit'), value: 'exit' },
      ],
    });

    console.log(divider);

    switch (module) {
      case 'products':
        await manageProducts();
        break;
      case 'categories':
        await manageCategories();
        break;
      case 'customers':
        await manageCustomers();
        break;
      case 'orders':
        await manageOrders();
        break;
      case 'transactions':
        await manageTransactions();
        break;
      case 'exit':
        info('Goodbye!');
        break mainLoop;
    }
  }
  process.exit(0);
}

// --- Products ---
async function manageProducts(): Promise<void> {
  while (true) {
    showTitle('🛒 PRODUCT MANAGEMENT');
    const { action } = await inquirer.prompt<{ action: string }>({
      type: 'list',
      name: 'action',
      message: 'Choose action:',
      choices: ['Add Product', 'List Products', 'Delete Product', 'Back'],
    });
    if (action === 'Add Product') await addProduct();
    else if (action === 'List Products') await listProducts();
    else if (action === 'Delete Product') await deleteProduct();
    else break;
  }
}

async function addProduct(): Promise<void> {
  try {
    const categories = await Category.find({});
    if (categories.length === 0) {
      warn('No categories found! Please add categories first.');
      return;
    }

    const answers = await inquirer.prompt<{
      name: string;
      sku: string;
      description: string;
      price: number;
      stock: number;
      weight: number;
      category: mongoose.Types.ObjectId;
      tags: string[];
      image: string[];
    }>([
      {
        type: 'input',
        name: 'name',
        message: 'Product name:',
        validate: (v) => v.length > 0 || 'Name required',
      },
      {
        type: 'input',
        name: 'sku',
        message: 'SKU:',
        validate: (v) => v.length > 0 || 'SKU required',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description:',
      },
      {
        type: 'input',
        name: 'price',
        message: 'Price ($):',
        validate: (v) => (!isNaN(Number(v)) && Number(v) > 0) || 'Enter valid price',
        filter: Number,
      },
      {
        type: 'input',
        name: 'stock',
        message: 'Stock quantity:',
        validate: (v) => (!isNaN(Number(v)) && Number(v) >= 0) || 'Enter valid stock count',
        filter: Number,
      },
      {
        type: 'input',
        name: 'weight',
        message: 'Weight (kg):',
        filter: (v) => (v === '' ? 0 : Number(v)),
      },
      {
        type: 'list',
        name: 'category',
        message: 'Select category:',
        choices: categories.map((c) => ({ name: c.name, value: c._id })),
      },
      {
        type: 'input',
        name: 'tags',
        message: 'Tags (comma separated):',
        filter: (v) =>
          v
            .split(',')
            //@ts-ignore
            .map((s) => s.trim())
            .filter(Boolean),
      },
      {
        type: 'input',
        name: 'image',
        message: 'Image URLs (comma separated):',
        filter: (v) =>
          v
            .split(',')
            //@ts-ignore
            .map((s) => s.trim())
            .filter(Boolean),
      },
    ]);

    await Product.create({ ...answers });
    success(`Product "${answers.name}" added successfully!`);
  } catch (e: unknown) {
    error(`Failed to add product: ${getErrorMessage(e)}`);
  }
}

async function listProducts(): Promise<void> {
  try {
    const products = await Product.find({}).populate('category');
    if (products.length === 0) {
      warn('No products found.');
      return;
    }

    printTable(
      ['SKU', 'Name', 'Price', 'Stock', 'Category'],
      products.map((p) => [
        p.sku,
        p.name.length > 20 ? p.name.slice(0, 17) + '...' : p.name,
        `$${p.price.toFixed(2)}`,
        p.stock,
        // category may be ObjectId if not populated - fallback included
        typeof p.category === 'object' && p.category !== null && 'name' in p.category ? p.category.name : 'No Category',
      ]),
    );
  } catch (e: unknown) {
    error(`Failed to list products: ${getErrorMessage(e)}`);
  }
}

async function deleteProduct(): Promise<void> {
  try {
    const products = await Product.find({});
    if (products.length === 0) {
      warn('No products to delete.');
      return;
    }
    const { id } = await inquirer.prompt<{ id: mongoose.Types.ObjectId }>({
      type: 'list',
      name: 'id',
      message: 'Select product to delete:',
      choices: products.map((p) => ({ name: `${p.name} (${p.sku})`, value: p._id })),
    });
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>({
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure? This cannot be undone.',
      default: false,
    });
    if (!confirm) {
      info('Deletion cancelled.');
      return;
    }
    await Product.deleteOne({ _id: id });
    success('Product deleted.');
  } catch (e: unknown) {
    error(`Failed to delete product: ${getErrorMessage(e)}`);
  }
}

// --- Categories ---
async function manageCategories(): Promise<void> {
  while (true) {
    showTitle('📂 CATEGORY MANAGEMENT');
    const { action } = await inquirer.prompt<{ action: string }>({
      type: 'list',
      name: 'action',
      message: 'Choose action:',
      choices: ['Add Category', 'List Categories', 'Delete Category', 'Back'],
    });
    if (action === 'Add Category') await addCategory();
    else if (action === 'List Categories') await listCategories();
    else if (action === 'Delete Category') await deleteCategory();
    else break;
  }
}

async function addCategory(): Promise<void> {
  try {
    const answers = await inquirer.prompt<{
      name: string;
      slug: string;
      description: string;
      images: string[];
    }>([
      {
        type: 'input',
        name: 'name',
        message: 'Category name:',
        validate: (v) => v.length > 0 || 'Name required',
      },
      {
        type: 'input',
        name: 'slug',
        message: 'URL slug:',
        validate: (v) => v.length > 0 || 'Slug required',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description:',
      },
      {
        type: 'input',
        name: 'images',
        message: 'Image URLs (comma separated):',
        filter: (v) =>
          v
            .split(',')
            //@ts-ignore
            .map((s) => s.trim())
            .filter(Boolean),
      },
    ]);

    await Category.create(answers);
    success(`Category "${answers.name}" added.`);
  } catch (e) {
    error(`Failed to add category: ${getErrorMessage(e)}`);
  }
}

async function listCategories(): Promise<void> {
  try {
    const categories = await Category.find({});
    if (categories.length === 0) {
      warn('No categories found.');
      return;
    }

    printTable(
      ['Name', 'Slug', 'Description'],
      categories.map((c) => [
        c.name,
        c.slug,
        (c.description ?? 'No description').length > 30
          ? c.description.slice(0, 27) + '...'
          : (c.description ?? 'No description'),
      ]),
    );
  } catch (e) {
    error(`Failed to list categories: ${getErrorMessage(e)}`);
  }
}

async function deleteCategory(): Promise<void> {
  try {
    const categories = await Category.find({});
    if (categories.length === 0) {
      warn('No categories to delete.');
      return;
    }

    const { id } = await inquirer.prompt<{ id: mongoose.Types.ObjectId }>({
      type: 'list',
      name: 'id',
      message: 'Select category to delete:',
      choices: categories.map((c) => ({ name: c.name, value: c._id })),
    });

    const { confirm } = await inquirer.prompt<{ confirm: boolean }>({
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure? Products in this category may become uncategorized.',
      default: false,
    });

    if (!confirm) {
      info('Deletion cancelled.');
      return;
    }
    await Category.deleteOne({ _id: id });
    success('Category deleted.');
  } catch (e) {
    error(`Failed to delete category: ${getErrorMessage(e)}`);
  }
}

// --- Customers ---
async function manageCustomers(): Promise<void> {
  while (true) {
    showTitle('👥 CUSTOMER MANAGEMENT');
    const { action } = await inquirer.prompt<{ action: string }>({
      type: 'list',
      name: 'action',
      message: 'Choose action:',
      choices: ['Add Customer', 'List Customers', 'Back'],
    });

    if (action === 'Add Customer') await addCustomer();
    else if (action === 'List Customers') await listCustomers();
    else break;
  }
}

async function addCustomer(): Promise<void> {
  try {
    const answers = await inquirer.prompt<{
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phoneNumber?: string;
      address1?: string;
      address2?: string;
    }>([
      {
        type: 'input',
        name: 'firstName',
        message: 'First Name:',
        validate: (v) => v.length > 0 || 'First name required',
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Last Name:',
        validate: (v) => v.length > 0 || 'Last name required',
      },
      {
        type: 'input',
        name: 'email',
        message: 'Email:',
        validate: (v) => /^\S+@\S+\.\S+$/.test(v) || 'Enter valid email',
      },
      {
        type: 'password',
        name: 'password',
        message: 'Password (min 6 chars):',
        mask: '*',
        validate: (v) => v.length >= 6 || 'Password too short',
      },
      {
        type: 'input',
        name: 'phoneNumber',
        message: 'Phone Number (optional):',
      },
      {
        type: 'input',
        name: 'address1',
        message: 'Shipping Address Line 1 (optional):',
      },
      {
        type: 'input',
        name: 'address2',
        message: 'Shipping Address Line 2 (optional):',
      },
    ]);

    await Customer.create({
      firstName: answers.firstName,
      lastName: answers.lastName,
      email: answers.email,
      password: answers.password,
      phoneNumber: answers.phoneNumber,
      shippingAddresses: answers.address1 ? [{ address1: answers.address1, address2: answers.address2 ?? '' }] : [],
    });

    success(`Customer "${answers.firstName} ${answers.lastName}" added.`);
  } catch (e) {
    error(`Failed to add customer: ${getErrorMessage(e)}`);
  }
}

async function listCustomers(): Promise<void> {
  try {
    const customers = await Customer.find({});
    if (customers.length === 0) {
      warn('No customers found.');
      return;
    }

    printTable(
      ['Name', 'Email', 'Phone', 'Status'],
      customers.map((c) => [
        `${c.firstName} ${c.lastName}`,
        c.email,
        c.phoneNumber ?? 'N/A',
        c.isActive ? 'Active' : 'Inactive',
      ]),
    );
  } catch (e) {
    error(`Failed to list customers: ${getErrorMessage(e)}`);
  }
}

// --- Orders ---
async function manageOrders(): Promise<void> {
  while (true) {
    showTitle('📦 ORDER MANAGEMENT');
    const { action } = await inquirer.prompt<{ action: string }>({
      type: 'list',
      name: 'action',
      message: 'Choose action:',
      choices: ['Create Order', 'List Orders', 'Update Order Status', 'Back'],
    });

    if (action === 'Create Order') await createOrder();
    else if (action === 'Update Order Status') await updateOrderStatus();
    else break;
  }
}

async function createOrder(): Promise<void> {
  try {
    const customers = await Customer.find({});
    const products = await Product.find({ stock: { $gt: 0 } });

    if (customers.length === 0) {
      warn('No customers found! Please add customers first.');
      return;
    }
    if (products.length === 0) {
      warn('No products in stock!');
      return;
    }

    const { customerId } = await inquirer.prompt<{ customerId: mongoose.Types.ObjectId }>({
      type: 'list',
      name: 'customerId',
      message: 'Select customer:',
      choices: customers.map((c) => ({
        name: `${c.firstName} ${c.lastName} (${c.email})`,
        value: c._id,
      })),
    });

    const items: Array<{ productId: mongoose.Types.ObjectId; quantity: number; price: number }> = [];

    let addMore = true;
    while (addMore) {
      const { productId } = await inquirer.prompt<{ productId: mongoose.Types.ObjectId }>({
        type: 'list',
        name: 'productId',
        message: 'Select product:',
        choices: products.map((p) => ({
          name: `${p.name} - $${p.price.toFixed(2)} (Stock: ${p.stock})`,
          value: p._id,
        })),
      });
      //@ts-ignore
      const product = products.find((p) => p._id.equals(productId));
      if (!product) {
        error('Selected product not found!');
        return;
      }

      const { quantity } = await inquirer.prompt<{ quantity: number }>({
        type: 'input',
        name: 'quantity',
        message: `Enter quantity (max ${product.stock}):`,
        validate: (v) => {
          const num = Number(v);
          if (!Number.isInteger(num) || num < 1) return 'Enter a positive integer';
          if (num > product.stock) return `Cannot order more than ${product.stock}`;
          return true;
        },
        filter: Number,
      });

      items.push({ productId, quantity, price: product.price });

      const { more } = await inquirer.prompt<{ more: boolean }>({
        type: 'confirm',
        name: 'more',
        message: 'Add another product?',
        default: false,
      });

      addMore = more;
    }

    const shippingAddress = await inquirer.prompt<{
      address1: string;
      address2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    }>([
      {
        type: 'input',
        name: 'address1',
        message: 'Shipping Address Line 1:',
        validate: (v) => v.length > 0 || 'Required',
      },
      { type: 'input', name: 'address2', message: 'Shipping Address Line 2 (optional):' },
      { type: 'input', name: 'city', message: 'City:', validate: (v) => v.length > 0 || 'Required' },
      { type: 'input', name: 'state', message: 'State:', validate: (v) => v.length > 0 || 'Required' },
      { type: 'input', name: 'zip', message: 'ZIP Code:', validate: (v) => v.length > 0 || 'Required' },
      { type: 'input', name: 'country', message: 'Country:', validate: (v) => v.length > 0 || 'Required' },
    ]);

    const { status } = await inquirer.prompt<{ status: string }>({
      type: 'list',
      name: 'status',
      message: 'Select order status:',
      choices: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    });

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await Order.create({
      customerId,
      items,
      totalAmount,
      shippingAddress,
      status,
    });

    // Reduce product stock
    for (const item of items) {
      await Product.updateOne({ _id: item.productId }, { $inc: { stock: -item.quantity } });
    }

    success(`Order created! Total amount: $${totalAmount.toFixed(2)}`);
  } catch (e) {
    error(`Failed to create order: ${getErrorMessage(e)}`);
  }
}

async function updateOrderStatus(): Promise<void> {
  try {
    const orders = await Order.find({}).populate('customerId');

    if (orders.length === 0) {
      warn('No orders found.');
      return;
    }

    const { orderId } = await inquirer.prompt<{ orderId: mongoose.Types.ObjectId }>({
      type: 'list',
      name: 'orderId',
      message: 'Select order to update:',
      choices: orders.map((o) => ({
        // @ts-ignore
        name: `#${o._id.toString()} - ${typeof o.customerId === 'object' && 'firstName' in o.customerId ? `${o.customerId.firstName} ${o.customerId.lastName}` : 'N/A'} | $${o.totalAmount.toFixed(2)} | ${o.status}`,
        value: o._id,
      })),
    });

    const { status } = await inquirer.prompt<{ status: string }>({
      type: 'list',
      name: 'status',
      message: 'New status:',
      choices: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    });

    await Order.updateOne({ _id: orderId }, { status });
    success('Order status updated!');
  } catch (e) {
    error(`Failed to update order status: ${getErrorMessage(e)}`);
  }
}

// --- Transactions ---
async function manageTransactions(): Promise<void> {
  while (true) {
    showTitle('💸 TRANSACTION MANAGEMENT');
    const { action } = await inquirer.prompt<{ action: string }>({
      type: 'list',
      name: 'action',
      message: 'Choose action:',
      choices: ['Create Transaction', 'List Transactions', 'Back'],
    });

    if (action === 'Create Transaction') await createTransaction();
    else break;
  }
}

async function createTransaction(): Promise<void> {
  try {
    const orders = await Order.find({}).populate('customerId');

    if (orders.length === 0) {
      warn('No orders found to add transactions.');
      return;
    }

    const { orderId } = await inquirer.prompt<{ orderId: mongoose.Types.ObjectId }>({
      type: 'list',
      name: 'orderId',
      message: 'Select order for transaction:',
      choices: orders.map((o) => ({
        //@ts-ignore
        name: `#${o._id.toString()} - $${o.totalAmount.toFixed(2)} (${typeof o.customerId === 'object' && 'firstName' in o.customerId ? `${o.customerId.firstName} ${o.customerId.lastName}` : 'N/A'})`,
        value: o._id,
      })),
    });
    //@ts-ignore
    const order = orders.find((o) => o._id.equals(orderId));
    if (!order) {
      error('Order not found.');
      return;
    }

    const answers = await inquirer.prompt<{
      transactionId: string;
      paymentGateway: string;
      amount: number;
      currency: string;
      status: string;
    }>([
      {
        type: 'input',
        name: 'transactionId',
        message: 'Transaction ID (gateway):',
        validate: (v) => v.length > 0 || 'Required',
      },
      {
        type: 'input',
        name: 'paymentGateway',
        message: 'Payment Gateway:',
        validate: (v) => v.length > 0 || 'Required',
      },
      {
        type: 'input',
        name: 'amount',
        message: 'Amount:',
        default: order.totalAmount.toString(),
        validate: (v) => (!isNaN(Number(v)) && Number(v) > 0) || 'Valid amount required',
        filter: Number,
      },
      {
        type: 'input',
        name: 'currency',
        message: 'Currency:',
        default: 'USD',
      },
      {
        type: 'list',
        name: 'status',
        message: 'Status:',
        choices: ['pending', 'successful', 'failed'],
        default: 'pending',
      },
    ]);

    await Transaction.create({
      orderId,
      transactionId: answers.transactionId,
      paymentGateway: answers.paymentGateway,
      amount: answers.amount,
      currency: answers.currency,
      status: answers.status,
    });

    success('Transaction created.');
  } catch (e) {
    error(`Failed to create transaction: ${getErrorMessage(e)}`);
  }
}

// --- Run main ---
main().catch((e) => {
  error(getErrorMessage(e));
  process.exit(1);
});
