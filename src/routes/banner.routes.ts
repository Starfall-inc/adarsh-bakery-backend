import express from 'express';
import BannerController from '../controllers/banner.controller';

const router = express.Router();

router.get('/', BannerController.getBanners);
router.get('/:id', BannerController.getBannerById);

export default router;
