import { verifyAccessToken } from '@/lib/auth';
import { UnauthorizedError } from '@/utils/errors';
import type { JwtPayload } from '@/types/auth';
import { cookies } from 'next/headers';

export async function authenticateRequest(request: Request): Promise<JwtPayload> {
  let token = '';

  // 1. Try to get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Fall back to cookie
  if (!token) {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('accessToken')?.value;
    if (cookieToken) {
      token = cookieToken;
    }
  }

  if (!token) {
    throw new UnauthorizedError('Authentication token missing or invalid');
  }

  try {
    const decoded = verifyAccessToken(token);
    return decoded;
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}
