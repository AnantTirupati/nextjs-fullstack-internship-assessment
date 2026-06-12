import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { NotFoundError } from '@/utils/errors';
import { sanitizeObject } from '@/utils/helpers';
import type { CreateProductInput, UpdateProductInput, ProductQueryInput } from '@/validators/product';

export async function createProduct(data: CreateProductInput, userId: string) {
  await connectDB();

  const sanitized = sanitizeObject(data as unknown as Record<string, unknown>) as unknown as CreateProductInput;

  const product = await Product.create({
    ...sanitized,
    createdBy: userId,
  });

  return product.toJSON();
}

export async function getProducts(query: ProductQueryInput) {
  await connectDB();

  const { page, limit, search, sort, order, category, minPrice, maxPrice } = query;

  // Build filter
  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$text = { $search: search };
  }

  if (category) {
    filter.category = category.toLowerCase();
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) (filter.price as Record<string, number>).$gte = minPrice;
    if (maxPrice !== undefined) (filter.price as Record<string, number>).$lte = maxPrice;
  }

  // Build sort
  const sortObj: Record<string, 1 | -1> = {};
  sortObj[sort] = order === 'asc' ? 1 : -1;

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export async function getProductById(id: string) {
  await connectDB();

  const product = await Product.findById(id)
    .populate('createdBy', 'name email')
    .lean();

  if (!product) {
    throw new NotFoundError('Product');
  }

  return product;
}

export async function updateProduct(id: string, data: UpdateProductInput) {
  await connectDB();

  const sanitized = sanitizeObject(data as unknown as Record<string, unknown>) as unknown as UpdateProductInput;

  const product = await Product.findByIdAndUpdate(
    id,
    { ...sanitized },
    { new: true, runValidators: true }
  )
    .populate('createdBy', 'name email')
    .lean();

  if (!product) {
    throw new NotFoundError('Product');
  }

  return product;
}

export async function deleteProduct(id: string) {
  await connectDB();

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new NotFoundError('Product');
  }

  return { id };
}
