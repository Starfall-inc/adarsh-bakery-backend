import { Request, Response } from 'express';
import DashboardService from '../services/dashboard.service';

class DashboardController {
  public async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await DashboardService.getDashboardStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
  }
}

export default new DashboardController();
