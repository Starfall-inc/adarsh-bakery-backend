import { Document, Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  Admin = 'admin',
  Sales = 'sales',
  ProductManager = 'product-manager',
  POS = 'pos',
  Delivery = 'delivery',
}

export interface IUser extends Document {
  username: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Sales,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  if (!this.password) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(password, this.password);
};

const User = model<IUser>('User', UserSchema);

export default User;
