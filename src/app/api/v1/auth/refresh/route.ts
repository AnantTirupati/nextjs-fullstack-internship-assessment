import { NextRequest } from 'next/server';
import { refreshTokens } from '@/services/auth.service';
import { validateBody } from '@/middleware/validate';
import { refreshTokenSchema } from '@/validators/auth';
import { successResponse, errorResponse } from '@/utils/helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validateBody(refreshTokenSchema, body);

    const tokens = await refreshTokens(validated.refreshToken);

    return successResponse(tokens, 'Tokens refreshed successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
