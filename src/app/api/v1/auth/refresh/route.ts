import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { refreshTokens } from '@/services/auth.service';
import { validateBody } from '@/middleware/validate';
import { refreshTokenSchema } from '@/validators/auth';
import { successResponse, errorResponse } from '@/utils/helpers';
import { ValidationError } from '@/utils/errors';

export async function POST(request: NextRequest) {
  try {
    let refreshToken = '';

    // Check cookie first, then fall back to body
    const cookieToken = request.cookies.get('refreshToken')?.value;
    if (cookieToken) {
      refreshToken = cookieToken;
    } else {
      const body = await request.json().catch(() => ({}));
      const validated = validateBody(refreshTokenSchema, body);
      refreshToken = validated.refreshToken;
    }

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    const tokens = await refreshTokens(refreshToken);

    // Set updated HTTP-only cookies
    const cookieStore = await cookies();
    const isSecure = process.env.NODE_ENV === 'production' && !request.nextUrl.hostname.includes('localhost');

    cookieStore.set('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    cookieStore.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return successResponse(tokens, 'Tokens refreshed successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
