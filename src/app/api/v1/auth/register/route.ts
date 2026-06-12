import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { registerUser } from '@/services/auth.service';
import { validateBody } from '@/middleware/validate';
import { registerSchema } from '@/validators/auth';
import { successResponse, errorResponse } from '@/utils/helpers';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 registrations per 15 minutes per IP
    const clientIp = getClientIp(request);
    checkRateLimit(`register:${clientIp}`, { windowMs: 15 * 60 * 1000, maxRequests: 5 });

    const body = await request.json();
    const validated = validateBody(registerSchema, body);

    const result = await registerUser(validated);

    // Set HTTP-only cookies
    const cookieStore = await cookies();
    cookieStore.set('accessToken', result.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    cookieStore.set('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return successResponse(result, 'User registered successfully', 201);
  } catch (error) {
    return errorResponse(error);
  }
}
