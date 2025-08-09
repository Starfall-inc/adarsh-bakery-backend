import express from 'express';
import BannerController from '../../controllers/banner.controller';
import auth from '../../middlewares/user/auth.middleware';
import authorize from '../../middlewares/authorize.middleware';
import upload from '../../middlewares/upload.middleware';
import { UserRole } from '../../models/user.model';
import validate from '../../middlewares/validate.middleware';
import { createBannerSchema, updateBannerSchema, deleteBannerSchema } from '../../schemas/validate.schema';

const router = express.Router();

router.get('/', auth, authorize([UserRole.Admin, UserRole.ProductManager]), BannerController.getBanners);

router.post(
  '/',
  auth,
  authorize([UserRole.Admin, UserRole.ProductManager]),
  upload.array('images'),
  //validate(createBannerSchema),
  BannerController.createBanner,
);

router.put(
  '/:id',
  auth,
  authorize([UserRole.Admin, UserRole.ProductManager]),
  upload.array('images'),
  // validate(updateBannerSchema),
  BannerController.updateBanner,
);

router.delete(
  '/:id',
  auth,
  authorize([UserRole.Admin, UserRole.ProductManager]),
  validate(deleteBannerSchema),
  BannerController.deleteBanner,
);

export default router;
