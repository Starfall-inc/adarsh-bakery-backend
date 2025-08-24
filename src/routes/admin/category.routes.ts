import { Router } from 'express';
import CategoryController from '../../controllers/category.controller';
import validate from '../../middlewares/validate.middleware';
import auth from '../../middlewares/user/auth.middleware';
import authorize from '../../middlewares/authorize.middleware';
import upload from '../../middlewares/upload.middleware';
import { UserRole } from '../../models/user.model';
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  getCategorySchema,
} from '../../schemas/validate.schema';

const router = Router();

router.get('/', auth, authorize([UserRole.Admin, UserRole.ProductManager]), CategoryController.getCategories);
router.get(
  '/:slug',
  auth,
  authorize([UserRole.Admin, UserRole.ProductManager]),
  validate(getCategorySchema),
  CategoryController.getCategoryBySlug,
);
router.post(
  '/',
  auth,
  authorize([UserRole.Admin, UserRole.ProductManager]),
  upload.array('images'),
  validate(createCategorySchema),
  CategoryController.createCategory,
);
router.put(
  '/:slug',
  auth,
  authorize([UserRole.Admin, UserRole.ProductManager]),
  upload.array('images'),
  validate(updateCategorySchema),
  CategoryController.updateCategory,
);
router.delete(
  '/:slug',
  auth,
  authorize([UserRole.Admin, UserRole.ProductManager]),
  validate(deleteCategorySchema),
  CategoryController.deleteCategory,
);

export default router;
