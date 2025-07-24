import Product, { IProduct } from '../models/product.model';
import Category, { ICategory } from '../models/category.model';
import NotFoundError from '../errors/NotFoundError';

class ProductService {
  /**
   * Get all products
   */
  async getProducts(): Promise<IProduct[]> {
    try {
      const products = await Product.find({}).populate({
        path: 'category',
        model: Category,
      });
      return products;
    } catch {
      throw new Error('Failed to retrieve products');
    }
  }

  /**
   * get a specific product by its SKU
   * @param sku - sku of the product
   */
  async getProductBySku(sku: string): Promise<IProduct> {
    try {
      const product = await Product.findOne({ sku: sku });
      if (!product) {
        throw new NotFoundError('Product Not Found');
      }
      return product;
    } catch {
      throw new Error('Failed to retrieve product');
    }
  }

  /**
   * get product by category slug
   * @param categorySlud
   */
  async getProductsByCategorySlug(categorySlug: string) {
    try {
      const category = await Category.findOne({ slug: categorySlug });
      if (!category) {
        throw new NotFoundError('Category Not Found');
      }
      const products = await Product.find({ category: category._id });
      return products;
    } catch {
      throw new Error('Failed to retrieve products');
    }
  }

  async searchProducts(query: string) {
    try {
      const products = await Product.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      }).populate({
        path: 'category',
        model: Category,
      });
      return products;
    } catch {
      throw new Error('Failed to retrieve products');
    }
  }
}
