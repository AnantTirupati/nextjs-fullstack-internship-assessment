import connectDB from '@/lib/db';
import User from '@/models/User';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/lib/auth';
import { ConflictError, UnauthorizedError } from '@/utils/errors';
import { sanitizeObject } from '@/utils/helpers';
import type { RegisterInput, LoginInput } from '@/validators/auth';
import type { JwtPayload } from '@/types/auth';

export async function registerUser(data: RegisterInput) {
  await connectDB();

  const sanitized = sanitizeObject(data);

  // Check for existing user
  const existingUser = await User.findOne({ email: sanitized.email });
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  // Create user
  const user = await User.create({
    name: sanitized.name,
    email: sanitized.email,
    password: sanitized.password,
    role: 'user', // Always register as 'user'
  });

  // Generate tokens
  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Store refresh token
  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: user.toJSON(),
    tokens: {
      accessToken,
      refreshToken,
    },
  };
}

export async function loginUser(data: LoginInput) {
  await connectDB();

  // Find user with password field
  const user = await User.findOne({ email: data.email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(data.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate tokens
  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Store refresh token
  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: user.toJSON(),
    tokens: {
      accessToken,
      refreshToken,
    },
  };
}

export async function getUserProfile(userId: string) {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  return user.toJSON();
}

export async function refreshTokens(currentRefreshToken: string) {
  await connectDB();

  let decoded: JwtPayload;
  try {
    decoded = verifyRefreshToken(currentRefreshToken);
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user || user.refreshToken !== currentRefreshToken) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  // Rotate tokens
  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const newAccessToken = signAccessToken(payload);
  const newRefreshToken = signRefreshToken(payload);

  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
