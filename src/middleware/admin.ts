import { ForbiddenError } from '@/utils/errors';
import type { JwtPayload } from '@/types/auth';

export function requireAdmin(user: JwtPayload): void {
  if (user.role !== 'admin') {
    throw new ForbiddenError('Admin access required');
  }
}
