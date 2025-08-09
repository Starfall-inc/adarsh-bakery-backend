import { Request, Response } from 'express';
import CategoryService from '../services/category.service';
import MinioService from '../services/minio.service';
import { minioConfig } from '../config/minio.config';

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
      const { files } = req;
      const imageUrls: string[] = [];

      if (files && Array.isArray(files)) {
        for (const file of files) {
          const objectName = `${Date.now()}-${file.originalname}`;
          const imageUrl = await MinioService.uploadBuffer(minioConfig.bucket, objectName, file.buffer);
          imageUrls.push(imageUrl);
        }
      }

      const categoryData = { ...req.body, images: imageUrls };
      const newCategory = await CategoryService.createCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create category' });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const { files } = req;
      const imageUrls: string[] = [];

      if (files && Array.isArray(files)) {
        for (const file of files) {
          const objectName = `${Date.now()}-${file.originalname}`;
          const imageUrl = await MinioService.uploadBuffer(minioConfig.bucket, objectName, file.buffer);
          imageUrls.push(imageUrl);
        }
      }

      const categoryData = { ...req.body, images: imageUrls };
      const updatedCategory = await CategoryService.updateCategory(req.params.slug, categoryData);
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
