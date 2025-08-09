import express from 'express';
import ProductController from '../../controllers/product.controller';
import validate from '../../middlewares/validate.middleware';
import auth from '../../middlewares/user/auth.middleware';
import authorize from '../../middlewares/authorize.middleware';
import upload from '../../middlewares/upload.middleware';
import { UserRole } from '../../models/user.model';
import { createProductSchema, updateProductSchema, deleteProductSchema } from '../../schemas/validate.schema';

const router = express.Router();

router.get('/', auth, authorize([UserRole.ProductManager, UserRole.Admin]), ProductController.getProducts);

router.post(
  '/',
  auth,
  authorize([UserRole.ProductManager, UserRole.Admin]),
  upload.array('images'),
  validate(createProductSchema),
  ProductController.createProduct,
);
router.put(
  '/:sku',
  auth,
  authorize([UserRole.ProductManager, UserRole.Admin]),
  upload.array('images'),
  validate(updateProductSchema),
  ProductController.updateProduct,
);
router.delete(
  '/:sku',
  auth,
  authorize([UserRole.ProductManager, UserRole.Admin]),
  validate(deleteProductSchema),
  ProductController.deleteProduct,
);

export default router;
