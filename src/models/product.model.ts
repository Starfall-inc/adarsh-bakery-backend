import { Document, Schema, model } from 'mongoose';
import { ICategory } from './category.model';

// 🧾 Document
// here document is an interface, its like blueprint
// we need that for type safety
// basically ensures all the data from te database has proper fields and types

export interface IProduct extends Document {
  // importatnt details
  sku: string;
  name: string;
  tags: string[];

  price: number;
  stock: number;
  weight: number;

  image: string[];

  category: Schema.Types.ObjectId | ICategory;

  description: string;
  attributes?: Record<string, string>;
  dietary: 'veg' | 'non-veg' | 'none';
}

// 🧬 Schema

// helps in defining the Shape of the data,
// like every cake document must have a name (RULE), price as number (SHAPE), etc
// it helpts with data consistency, cuz mongoDB is schema less (we can literally put anything)

export const ProductSchema = new Schema<IProduct>({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tags: { type: [String], required: false },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  weight: { type: Number, min: 0, default: 0 },
  image: { type: [String], default: [] },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  attributes: { type: Schema.Types.Mixed, default: {} },
  dietary: {
    type: String,
    enum: ['veg', 'non-veg', 'none'],
    default: 'veg',
  },
});

// 🏗️ model

// Model is the constructor function that will turn a schema into an table like object ?
// we can interact with it using, insert, find, update and delete?

const Product = model<IProduct>('Product', ProductSchema);

export default Product;
