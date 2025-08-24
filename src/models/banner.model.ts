import { Document, Schema, model } from 'mongoose';

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

const Banner = model<IBanner>('Banner', BannerSchema);

export default Banner;
