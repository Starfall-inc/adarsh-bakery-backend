import { Document, Schema, model } from 'mongoose';
import { replaceBaseUrl } from '../utils/replaceUrl';

export interface IBanner extends Document {
  name: string;
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    ctaText: { type: String, required: true },
    imageUrl: { type: String, required: true },
    linkUrl: { type: String, default: '#' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, required: true, unique: true },
  },
  { timestamps: true },
);

// Banner
BannerSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.imageUrl = replaceBaseUrl(obj.imageUrl);
  return obj;
};

const Banner = model<IBanner>('Banner', BannerSchema);

export default Banner;
