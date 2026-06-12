import { verifyAccessToken } from '@/lib/auth';
import { UnauthorizedError } from '@/utils/errors';
import type { JwtPayload } from '@/types/auth';

export async function authenticateRequest(request: Request): Promise<JwtPayload> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('Token not provided');
  }

  try {
    const decoded = verifyAccessToken(token);
    return decoded;
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}
