import express from 'express';
import ProductController from '../controllers/product.controller';
import validate from '../middlewares/validate.middleware';
import {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  getProductSchema,
} from '../schemas/validate.schema';

const router = express.Router();

router.get('/', ProductController.getProducts);
router.get('/search/:query', ProductController.searchProducts);
router.get('/:sku', validate(getProductSchema), ProductController.getProductBySku);
router.get('/category/:categorySlug', ProductController.getProductsByCategorySlug);

router.post('/', validate(createProductSchema), ProductController.createProduct);
router.put('/:sku', validate(updateProductSchema), ProductController.updateProduct);
router.delete('/:sku', validate(deleteProductSchema), ProductController.deleteProduct);

export default router;
