import Customer, { ICustomer } from '../models/customer.model';
import NotFoundError from '../errors/NotFoundError';
import { CustomerInput } from '../schemas/customer.schema';
import jwt from 'jsonwebtoken';
import Product from '../models/product.model';

class CustomerService {
  // Authentication
  public async signUp(customerData: CustomerInput): Promise<{ customer: ICustomer; token: string }> {
    try {
      const customer = await Customer.create(customerData);
      const token = jwt.sign(
        { id: customer._id, email: customer.email },
        process.env.JWT_SECRET || 'your_default_secret',
        { expiresIn: '1d' },
      );
      return { customer, token };
    } catch (error) {
      throw new Error('Failed to sign up customer');
    }
  }

  public async login(email: string, password: string): Promise<{ customer: ICustomer; token: string } | null> {
    try {
      const customer = await Customer.findOne({ email });
      if (!customer) {
        throw new NotFoundError('Customer not found');
      }
      const isMatch = await customer.comparePassword(password);
      if (!isMatch) {
        return null; // Invalid credentials
      }
      const token = jwt.sign(
        { id: customer._id, email: customer.email },
        process.env.JWT_SECRET || 'your_default_secret',
        { expiresIn: '1d' },
      );
      customer.lastLoginAt = new Date();
      await customer.save();
      return { customer, token };
    } catch (error) {
      throw new Error('Failed to login customer');
    }
  }

  public async getCustomerProfile(customerId: string): Promise<ICustomer> {
    try {
      const customer = await Customer.findById(customerId).select('-password');
      if (!customer) {
        throw new NotFoundError('Customer not found');
      }
      return customer;
    } catch (error) {
      throw new Error('Failed to retrieve customer profile');
    }
  }

  public async updateCustomerProfile(
    customerId: string,
    customerData: Partial<CustomerInput>,
  ): Promise<ICustomer | null> {
    try {
      return await Customer.findByIdAndUpdate(customerId, customerData, { new: true }).select('-password');
    } catch {
      throw new Error('Failed to update customer profile');
    }
  }

  // Cart Management
  public async getCart(customerId: string): Promise<ICustomer['cart']> {
    const customer = await Customer.findById(customerId).populate('cart.productId');
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    return customer.cart;
  }

  public async addToCart(customerId: string, productId: string, quantity: number): Promise<ICustomer['cart']> {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const itemIndex = customer.cart.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
      customer.cart[itemIndex].quantity += quantity;
    } else {
      //@ts-ignore
      customer.cart.push({ productId: product._id, quantity });
    }

    await customer.save();
    return (await customer.populate('cart.productId')).cart;
  }

  public async updateCartItemQuantity(
    customerId: string,
    productId: string,
    quantity: number,
  ): Promise<ICustomer['cart']> {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    const itemIndex = customer.cart.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        customer.cart.splice(itemIndex, 1); // Remove item if quantity is 0 or less
      } else {
        customer.cart[itemIndex].quantity = quantity;
      }
    } else {
      throw new NotFoundError('Item not found in cart');
    }

    await customer.save();
    return (await customer.populate('cart.productId')).cart;
  }

  public async removeCartItem(customerId: string, productId: string): Promise<ICustomer['cart']> {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    customer.cart = customer.cart.filter((item) => item.productId.toString() !== productId);

    await customer.save();
    return (await customer.populate('cart.productId')).cart;
  }

  // Wishlist Management
  public async getWishlist(customerId: string): Promise<ICustomer['wishlist']> {
    const customer = await Customer.findById(customerId).populate('wishlist');
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    return customer.wishlist;
  }

  public async addToWishlist(customerId: string, productId: string): Promise<ICustomer['wishlist']> {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    //@ts-ignore
    if (!customer.wishlist.includes(product._id)) {
      //@ts-ignore
      customer.wishlist.push(product._id);
      await customer.save();
    }
    return (await customer.populate('wishlist')).wishlist;
  }

  public async removeFromWishlist(customerId: string, productId: string): Promise<ICustomer['wishlist']> {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    customer.wishlist = customer.wishlist.filter((id) => id.toString() !== productId);
    await customer.save();
    return (await customer.populate('wishlist')).wishlist;
  }

  // Customer Management (Admin)
  public async getCustomers(): Promise<ICustomer[]> {
    try {
      return await Customer.find({});
    } catch {
      throw new Error('Failed to retrieve customers');
    }
  }

  public async getCustomerById(id: string): Promise<ICustomer> {
    try {
      const customer = await Customer.findById(id);
      if (!customer) {
        throw new NotFoundError('Customer Not Found');
      }
      return customer;
    } catch {
      throw new Error('Failed to retrieve customer');
    }
  }

  // Profile Management (Customer)
  public async updateCustomer(id: string, customerData: Partial<CustomerInput>): Promise<ICustomer | null> {
    try {
      return await Customer.findByIdAndUpdate(id, customerData, { new: true });
    } catch {
      throw new Error('Failed to update customer');
    }
  }

  public async deleteCustomer(id: string): Promise<void> {
    try {
      const result = await Customer.findByIdAndDelete(id);
      if (!result) {
        throw new NotFoundError('Customer Not Found');
      }
    } catch {
      throw new Error('Error deleting customer');
    }
  }
}

export default new CustomerService();
