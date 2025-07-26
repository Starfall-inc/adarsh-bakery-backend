import Category, { ICategory } from '../models/category.model';
import NotFoundError from '../errors/NotFoundError';
import { CategoryInput } from '../schemas/category.schema';

class CategoryService {
  public async getCategories(): Promise<ICategory[]> {
    try {
      const categories = await Category.find({});
      return categories;
    } catch {
      throw new Error('Failed to retrieve categories');
    }
  }

  async getCategoryBySlug(slug: string): Promise<ICategory> {
    try {
      const category = await Category.findOne({ slug: slug });
      if (!category) {
        throw new NotFoundError('Category Not Found');
      }
      return category;
    } catch {
      throw new Error('Failed to retrieve category');
    }
  }

  async createCategory(categoryData: CategoryInput): Promise<ICategory> {
    try {
      const category = await Category.create(categoryData);
      return category;
    } catch {
      throw new Error('Failed to create category');
    }
  }

  async updateCategory(slug: string, categoryData: Partial<ICategory>) {
    try {
      const category = await Category.findOneAndUpdate({ slug: slug }, categoryData, { new: true });
      if (!category) {
        throw new NotFoundError('Category Not Found');
      }
      return category;
    } catch {
      throw new Error('IDK, something went wrong');
    }
  }

  async deleteCategory(slug: string) {
    try {
      const category = await Category.findOneAndDelete({ slug: slug });
      if (!category) {
        throw new NotFoundError('Category Not Found');
      }
    } catch {
      throw new Error('Error Deleting Category');
    }
  }
}

export default new CategoryService();
