import { Document, Schema, model } from 'mongoose';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface ICartItem extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: number;
  shippingAddresses: {
    address1: string;
    address2: string;
  }[];
  cart: ICartItem[];
  lastLoginAt?: Date;
  isActive: boolean;
  orderHistory: mongoose.Types.ObjectId[]; // Array of Order IDs
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false },
);

const CustomerSchema = new Schema<ICustomer>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phoneNumber: { type: Number, trim: true },

    orderHistory: [
      {
        // Array of ObjectIds
        type: mongoose.Types.ObjectId,
        ref: 'Order', // Reference to the Order model
      },
    ],

    shippingAddresses: [
      {
        address1: { type: String, required: true },
        address2: { type: String, required: true },
      },
    ],
    cart: [CartItemSchema],
    lastLoginAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

CustomerSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

CustomerSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Customer = model<ICustomer>('Customer', CustomerSchema);

export default Customer;
