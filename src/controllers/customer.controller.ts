import { Request, Response } from 'express';
import CustomerService from '../services/customer.service';
import { CreateCustomerInput, LoginCustomerInput } from '../schemas/customer.schema';
import { AuthRequest } from '../middlewares/auth.middleware';
import jwt from 'jsonwebtoken';

class CustomerController {
  // Auth
  async signUp(req: Request<{}, {}, CreateCustomerInput>, res: Response) {
    try {
      const { name, email, password } = req.body;
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      const { customer, token } = await CustomerService.signUp({
        email,
        password,
        firstName,
        lastName,
      });
      const decodedToken = jwt.decode(token) as { exp: number };
      res.status(201).json({ customer, token, expiresAt: decodedToken.exp });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to sign up customer' });
    }
  }

  async login(req: Request<{}, {}, LoginCustomerInput>, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await CustomerService.login(email, password);
      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const decodedToken = jwt.decode(result.token) as { exp: number };
      res.status(200).json({ ...result, expiresAt: decodedToken.exp });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to login customer' });
    }
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.customer) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      const customer = await CustomerService.getCustomerProfile(req.customer.id);
      res.status(200).json({ customer });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch profile' });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.customer) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      const customer = await CustomerService.updateCustomerProfile(req.customer.id, req.body);
      res.status(200).json({ customer });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to update profile' });
    }
  }

  // Cart Management
  async getCart(req: AuthRequest, res: Response) {
    try {
      if (!req.customer) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      const cart = await CustomerService.getCart(req.customer.id);
      res.status(200).json({ cart });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to retrieve cart' });
    }
  }

  async addToCart(req: AuthRequest, res: Response) {
    try {
      if (!req.customer) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      const { productId, quantity } = req.body;
      const cart = await CustomerService.addToCart(req.customer.id, productId, quantity);
      res.status(200).json({ cart });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to add item to cart' });
    }
  }

  async updateCartItemQuantity(req: AuthRequest, res: Response) {
    try {
      if (!req.customer) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      const { productId, quantity } = req.body;
      const cart = await CustomerService.updateCartItemQuantity(req.customer.id, productId, quantity);
      res.status(200).json({ cart });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to update cart item quantity' });
    }
  }

  async removeCartItem(req: AuthRequest, res: Response) {
    try {
      if (!req.customer) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      const { productId } = req.params;
      const cart = await CustomerService.removeCartItem(req.customer.id, productId);
      res.status(200).json({ cart });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to remove item from cart' });
    }
  }

  // Wishlist Management
  async getWishlist(req: AuthRequest, res: Response) {
    try {
      if (!req.customer) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      const wishlist = await CustomerService.getWishlist(req.customer.id);
      res.status(200).json({ wishlist });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to retrieve wishlist' });
    }
  }

  async addToWishlist(req: AuthRequest, res: Response) {
    try {
      if (!req.customer) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      const { productId } = req.body;
      const wishlist = await CustomerService.addToWishlist(req.customer.id, productId);
      res.status(200).json({ wishlist });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to add item to wishlist' });
    }
  }

  async removeFromWishlist(req: AuthRequest, res: Response) {
    try {
      if (!req.customer) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      const { productId } = req.params;
      const wishlist = await CustomerService.removeFromWishlist(req.customer.id, productId);
      res.status(200).json({ wishlist });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to remove item from wishlist' });
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
