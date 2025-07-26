import Customer, { ICustomer } from '../models/customer.model';
import NotFoundError from '../errors/NotFoundError';
import { CustomerInput } from '../schemas/customer.schema';
import jwt from 'jsonwebtoken';

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
