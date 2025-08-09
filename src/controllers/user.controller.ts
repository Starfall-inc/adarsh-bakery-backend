import { Request, Response } from 'express';
import UserService from '../services/user.service';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/user.model';

class UserController {
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating user' });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.deleteUser(req.params.id);
      if (user) {
        res.status(200).json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user' });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const user = await UserService.findByUsername(username);

      if (!user || !password || !user.password) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
    }
  }

  public async getSetupStatus(req: Request, res: Response): Promise<void> {
    try {
      const userCount = await UserService.getUserCount();
      res.status(200).json({ setupNeeded: userCount === 0 });
    } catch (error) {
      res.status(500).json({ message: 'Error checking setup status' });
    }
  }

  public async initialSetup(req: Request, res: Response): Promise<void> {
    try {
      const userCount = await UserService.getUserCount();
      if (userCount > 0) {
        res.status(403).json({ message: 'Initial setup already completed' });
        return;
      }

      const { username, password } = req.body;
      const user = await UserService.createUser({ username, password, role: UserRole.Admin });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error during initial setup' });
    }
  }
}

export default new UserController();
