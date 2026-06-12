import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { loginUser } from '@/services/auth.service';
import { validateBody } from '@/middleware/validate';
import { loginSchema } from '@/validators/auth';
import { successResponse, errorResponse } from '@/utils/helpers';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 10 login attempts per 15 minutes per IP
    const clientIp = getClientIp(request);
    checkRateLimit(`login:${clientIp}`, { windowMs: 15 * 60 * 1000, maxRequests: 10 });

    const body = await request.json();
    const validated = validateBody(loginSchema, body);

    const result = await loginUser(validated);

    // Set HTTP-only cookies
    const cookieStore = await cookies();
    const isSecure = process.env.NODE_ENV === 'production' && !request.nextUrl.hostname.includes('localhost');
    
    cookieStore.set('accessToken', result.tokens.accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    cookieStore.set('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return successResponse(result, 'Login successful');
  } catch (error) {
    return errorResponse(error);
  }
}
