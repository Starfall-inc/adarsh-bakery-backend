import express from 'express';
import CategoryController from '../controllers/category.controller';
import validate from '../middlewares/validate.middleware';
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  getCategorySchema,
} from '../schemas/validate.schema';

const router = express.Router();

router.get('/', CategoryController.getCategories);
router.get('/:slug', validate(getCategorySchema), CategoryController.getCategoryBySlug);

router.post('/', validate(createCategorySchema), CategoryController.createCategory);
router.put('/:slug', validate(updateCategorySchema), CategoryController.updateCategory);
router.delete('/:slug', validate(deleteCategorySchema), CategoryController.deleteCategory);

export default router;
