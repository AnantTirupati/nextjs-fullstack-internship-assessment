import mongoose, { Schema, Model } from 'mongoose';

export interface IProductDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [2000, 'Description must be at most 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      lowercase: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator reference is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform(_doc: any, ret: any) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Text index for search
ProductSchema.index({ title: 'text', description: 'text' });

// Index for category filtering
ProductSchema.index({ category: 1 });

// Index for price range queries
ProductSchema.index({ price: 1 });

// Compound index for created by and date
ProductSchema.index({ createdBy: 1, createdAt: -1 });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Product: Model<any> =
  mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
