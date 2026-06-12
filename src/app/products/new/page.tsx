'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/context/ToastContext';

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

export default function NewProductPage() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const { createProduct } = useProducts();
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      await createProduct({
        title: data.title,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        stock: Number(data.stock),
        imageUrl: data.imageUrl || undefined,
      });
      toast.success('Product created successfully!');
      router.push('/products');
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to create product';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner spinner-dark spinner-lg" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <button onClick={() => router.back()} className="btn btn-ghost btn-sm" style={{ marginBottom: '12px' }}>
          ← Back
        </button>
        <h1 className="page-title">Add New Product</h1>
        <p className="page-subtitle">Fill in the details to create a new product</p>
      </div>

      <div className="card" style={{ maxWidth: '680px', padding: '40px' }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">Product Title *</label>
            <input id="title" type="text" className="form-input" placeholder="e.g. Premium Wireless Headphones" {...register('title', { required: 'Title is required', minLength: { value: 2, message: 'Min 2 characters' } })} />
            {errors.title && <span className="form-error">{errors.title.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description *</label>
            <textarea id="description" className="form-input" placeholder="Describe your product..." rows={4} style={{ resize: 'vertical' }} {...register('description', { required: 'Description is required' })} />
            {errors.description && <span className="form-error">{errors.description.message}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="price" className="form-label">Price ($) *</label>
              <input id="price" type="number" step="0.01" className="form-input" placeholder="0.00" {...register('price', { required: 'Price is required', min: { value: 0, message: 'Must be positive' }, valueAsNumber: true })} />
              {errors.price && <span className="form-error">{errors.price.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="stock" className="form-label">Stock *</label>
              <input id="stock" type="number" className="form-input" placeholder="0" {...register('stock', { required: 'Stock is required', min: { value: 0, message: 'Must be positive' }, valueAsNumber: true })} />
              {errors.stock && <span className="form-error">{errors.stock.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">Category *</label>
            <input id="category" type="text" className="form-input" placeholder="e.g. Electronics, Clothing, Books" {...register('category', { required: 'Category is required' })} />
            {errors.category && <span className="form-error">{errors.category.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl" className="form-label">Image URL (Optional)</label>
            <input id="imageUrl" type="text" className="form-input" placeholder="https://example.com/image.jpg" {...register('imageUrl')} />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ flex: 1 }}>
              {isLoading ? (<><span className="spinner" /> Creating...</>) : 'Create Product'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => router.back()}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
