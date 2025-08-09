import { Request, Response, NextFunction } from 'express';
import Banner from '../models/banner.model';
import MinioService from '../services/minio.service';
import { minioConfig } from '../config/minio.config';
import logger from '../config/logger';

class BannerController {
  public async createBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, title, subtitle, ctaText, linkUrl, isActive, order } = req.body;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({ message: 'Banner image is required.' });
        return;
      }

      const file = files[0];
      const objectName = `banners/${Date.now()}-${file.originalname}`;
      const imageUrl = await MinioService.uploadBuffer(minioConfig.bucket, objectName, file.buffer);

      const banner = new Banner({
        name,
        title,
        subtitle,
        ctaText,
        imageUrl,
        linkUrl,
        isActive: isActive === 'true',
        order: parseInt(order),
      });

      await banner.save();
      res.status(201).json(banner);
    } catch (error) {
      logger.error('Error creating banner:', error);
      next(error);
    }
  }

  public async getBanners(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const banners = await Banner.find().sort({ order: 1 });
      res.status(200).json(banners);
    } catch (error) {
      logger.error('Error fetching banners:', error);
      next(error);
    }
  }

  public async getBannerById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const banner = await Banner.findById(id);

      if (!banner) {
        res.status(404).json({ message: 'Banner not found.' });
        return;
      }
      res.status(200).json(banner);
    } catch (error) {
      logger.error('Error fetching banner by ID:', error);
      next(error);
    }
  }

  public async updateBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, title, subtitle, ctaText, linkUrl, isActive, order } = req.body;
      const files = req.files as Express.Multer.File[];

      const banner = await Banner.findById(id);

      if (!banner) {
        res.status(404).json({ message: 'Banner not found.' });
        return;
      }

      if (files && files.length > 0) {
        // Delete old image from Minio
        const oldObjectName = banner.imageUrl.split('/').pop();
        if (oldObjectName) {
          await MinioService.deleteObject(minioConfig.bucket, `banners/${oldObjectName}`);
        }

        // Upload new image
        const file = files[0];
        const objectName = `banners/${Date.now()}-${file.originalname}`;
        banner.imageUrl = await MinioService.uploadBuffer(minioConfig.bucket, objectName, file.buffer);
      }

      banner.name = name || banner.name;
      banner.title = title || banner.title;
      banner.subtitle = subtitle || banner.subtitle;
      banner.ctaText = ctaText || banner.ctaText;
      banner.linkUrl = linkUrl || banner.linkUrl;
      banner.isActive = isActive !== undefined ? isActive === 'true' : banner.isActive;
      banner.order = order !== undefined ? parseInt(order) : banner.order;

      await banner.save();
      res.status(200).json(banner);
    } catch (error) {
      logger.error('Error updating banner:', error);
      next(error);
    }
  }

  public async deleteBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const banner = await Banner.findByIdAndDelete(id);

      if (!banner) {
        res.status(404).json({ message: 'Banner not found.' });
        return;
      }

      // Delete image from Minio
      const objectName = banner.imageUrl.split('/').pop();
      if (objectName) {
        await MinioService.deleteObject(minioConfig.bucket, `banners/${objectName}`);
      }

      res.status(200).json({ message: 'Banner deleted successfully.' });
    } catch (error) {
      logger.error('Error deleting banner:', error);
      next(error);
    }
  }
}

export default new BannerController();
