import { Document, Schema, model } from 'mongoose';

/**
 * @typedef {object} Category
 * @property {string} name - The name of the category
 * @property {string} slug - Url Friendly name
 * @property {string[]} images - an array of image urls for category
 * @property {string} descriptio - A detailed description of the category
 */
export interface ICategory extends Document {
  name: string;
  slug: string;
  images: string[];
  description: string;
}

export const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    images: { type: [String] },
    description: { type: String },
  },
  { timestamps: true },
);

const Category = model<ICategory>('Category', CategorySchema);
