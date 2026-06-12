import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { authenticateRequest } from '@/middleware/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { successResponse, errorResponse } from '@/utils/helpers';

export async function POST(request: NextRequest) {
  try {
    try {
      const decoded = await authenticateRequest(request);
      await connectDB();
      // Remove refresh token from DB
      await User.findByIdAndUpdate(decoded.userId, { $unset: { refreshToken: 1 } });
    } catch {
      // Ignore auth failure on logout
    }

    // Clear cookies
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return successResponse(null, 'Logged out successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
