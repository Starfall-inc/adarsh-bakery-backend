import { Request, Response } from 'express';
import ProductService from '../services/product.service';

class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  }

  async getProductBySku(req: Request, res: Response) {
    try {
      const product = await ProductService.getProductBySku(req.params.sku);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch product ${req.params.sku}` });
    }
  }

  async getProductsByCategorySlug(req: Request, res: Response) {
    try {
      const products = await ProductService.getProductsByCategorySlug(req.params.categorySlug);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch products by category' });
    }
  }

  async searchProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.searchProducts(req.params.query);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to search for products' });
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const newProduct = await ProductService.createProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create product' });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const updatedProduct = await ProductService.updateProduct(req.params.sku, req.body);
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: `Failed to update product ${req.params.sku}` });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      await ProductService.deleteProduct(req.params.sku);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: `Failed to delete product ${req.params.sku}` });
    }
  }
}

export default new ProductController();
