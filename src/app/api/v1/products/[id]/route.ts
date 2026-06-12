import { NextRequest } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/services/product.service';
import { authenticateRequest } from '@/middleware/auth';
import { requireAdmin } from '@/middleware/admin';
import { validateBody } from '@/middleware/validate';
import { updateProductSchema } from '@/validators/product';
import { successResponse, errorResponse } from '@/utils/helpers';
import { ValidationError } from '@/utils/errors';
import mongoose from 'mongoose';

function validateObjectId(id: string): void {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid product ID format');
  }
}

// GET /api/v1/products/:id - Get product by ID (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    validateObjectId(id);

    const product = await getProductById(id);

    return successResponse(product, 'Product fetched successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

// PUT /api/v1/products/:id - Update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    validateObjectId(id);

    const user = await authenticateRequest(request);
    requireAdmin(user);

    const body = await request.json();
    const validated = validateBody(updateProductSchema, body);

    const product = await updateProduct(id, validated);

    return successResponse(product, 'Product updated successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

// DELETE /api/v1/products/:id - Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    validateObjectId(id);

    const user = await authenticateRequest(request);
    requireAdmin(user);

    const result = await deleteProduct(id);

    return successResponse(result, 'Product deleted successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
