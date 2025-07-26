import { Request, Response } from 'express';
import CategoryService from '../services/category.service';

class CategoryController {
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  }

  async getCategoryBySlug(req: Request, res: Response) {
    try {
      const category = await CategoryService.getCategoryBySlug(req.params.slug);
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch category ${req.params.slug}` });
    }
  }

  async createCategory(req: Request, res: Response) {
    try {
      const newCategory = await CategoryService.createCategory(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create category' });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const updatedCategory = await CategoryService.updateCategory(req.params.slug, req.body);
      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: `Failed to update category ${req.params.slug}` });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      await CategoryService.deleteCategory(req.params.slug);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: `Failed to delete category ${req.params.slug}` });
    }
  }
}

export default new CategoryController();
