import { z } from 'zod';

export const createProductSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be at most 200 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be at most 2000 characters')
    .trim(),
  price: z
    .number()
    .min(0, 'Price cannot be negative')
    .max(1000000, 'Price is too high'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must be at most 100 characters')
    .trim()
    .toLowerCase(),
  stock: z
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .default(0),
  imageUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.enum(['title', 'price', 'createdAt', 'stock', 'category']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
