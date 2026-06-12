import { NextRequest } from 'next/server';
import { getProducts, createProduct } from '@/services/product.service';
import { authenticateRequest } from '@/middleware/auth';
import { requireAdmin } from '@/middleware/admin';
import { validateBody, validateQuery } from '@/middleware/validate';
import { createProductSchema, productQuerySchema } from '@/validators/product';
import { successResponse, errorResponse } from '@/utils/helpers';

// GET /api/v1/products - Get all products (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = validateQuery(productQuerySchema, searchParams);

    const result = await getProducts(query);

    return successResponse(result.products, 'Products fetched successfully', 200, result.pagination);
  } catch (error) {
    return errorResponse(error);
  }
}

// POST /api/v1/products - Create product (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    requireAdmin(user);

    const body = await request.json();
    const validated = validateBody(createProductSchema, body);

    const product = await createProduct(validated, user.userId);

    return successResponse(product, 'Product created successfully', 201);
  } catch (error) {
    return errorResponse(error);
  }
}
