import { Request, Response } from 'express';
import ProductService from '../services/product.service';
import MinioService from '../services/minio.service';
import { minioConfig } from '../config/minio.config';

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

  async getProductsByCategoryId(req: Request, res: Response) {
    try {
      const products = await ProductService.getProductsByCategoryId(req.params.id);
      console.log(req.params.id);
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
      const { files } = req;
      const imageUrls: string[] = [];

      if (files && Array.isArray(files)) {
        for (const file of files) {
          const objectName = `${Date.now()}-${file.originalname}`;
          const imageUrl = await MinioService.uploadBuffer(minioConfig.bucket, objectName, file.buffer);
          imageUrls.push(imageUrl);
        }
      }

      const productData = { ...req.body, image: imageUrls };
      const newProduct = await ProductService.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create product' });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const { files } = req;
      const { existingImages, imagesToRemove, ...otherData } = req.body;

      // Handle new image uploads
      const newImageUrls: string[] = [];
      if (files && Array.isArray(files)) {
        for (const file of files) {
          const objectName = `${Date.now()}-${file.originalname}`;
          const imageUrl = await MinioService.uploadBuffer(minioConfig.bucket, objectName, file.buffer);
          newImageUrls.push(imageUrl);
        }
      }

      // Get current product to access existing images
      const currentProduct = await ProductService.getProductBySku(req.params.sku);
      if (!currentProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Handle image management
      let finalImages: string[] = [];

      if (existingImages && Array.isArray(existingImages)) {
        // Frontend sent existing images - use those as base
        finalImages = [...existingImages];

        // If there are images to remove, filter them out
        if (imagesToRemove && imagesToRemove.length > 0) {
          const indicesToRemove = JSON.parse(imagesToRemove);
          finalImages = finalImages.filter((_, index) => !indicesToRemove.includes(index));
        }
      } else {
        // No existing images info from frontend - keep current images
        finalImages = currentProduct.image || [];
      }

      // Add new uploaded images
      finalImages = [...finalImages, ...newImageUrls];

      // Prepare update data
      const productData = {
        ...otherData,
        image: finalImages,
      };

      const updatedProduct = await ProductService.updateProduct(req.params.sku, productData);
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
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
