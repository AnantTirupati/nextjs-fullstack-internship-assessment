import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must be at most 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform(_doc: any, ret: any) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for faster email lookups
UserSchema.index({ email: 1 });

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password instance method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const User: Model<any> =
  mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
