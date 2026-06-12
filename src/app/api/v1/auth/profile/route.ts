import { NextRequest } from 'next/server';
import { getUserProfile } from '@/services/auth.service';
import { authenticateRequest } from '@/middleware/auth';
import { successResponse, errorResponse } from '@/utils/helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const profile = await getUserProfile(user.userId);

    return successResponse(profile, 'Profile fetched successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
