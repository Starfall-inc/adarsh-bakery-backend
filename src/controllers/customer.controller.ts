
import { Request, Response } from 'express';
import CustomerService from '../services/customer.service';

class CustomerController {
  // Auth
  async signUp(req: Request, res: Response) {
    try {
      const { customer, token } = await CustomerService.signUp(req.body);
      res.status(201).json({ customer, token });
    } catch (error) {
      res.status(500).json({ message: 'Failed to sign up customer' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await CustomerService.login(email, password);
      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Failed to login customer' });
    }
  }

  // Customer Management
  async getCustomers(req: Request, res: Response) {
    try {
      const customers = await CustomerService.getCustomers();
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch customers' });
    }
  }

  async getCustomerById(req: Request, res: Response) {
    try {
      const customer = await CustomerService.getCustomerById(req.params.id);
      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch customer ${req.params.id}` });
    }
  }

  async updateCustomer(req: Request, res: Response) {
    try {
      const updatedCustomer = await CustomerService.updateCustomer(req.params.id, req.body);
      res.status(200).json(updatedCustomer);
    } catch (error) {
      res.status(500).json({ message: `Failed to update customer ${req.params.id}` });
    }
  }

  async deleteCustomer(req: Request, res: Response) {
    try {
      await CustomerService.deleteCustomer(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: `Failed to delete customer ${req.params.id}` });
    }
  }
}

export default new CustomerController();
