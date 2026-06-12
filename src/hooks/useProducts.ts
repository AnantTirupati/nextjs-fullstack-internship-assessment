'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/utils/api-client';
import type { IProduct, CreateProductRequest, UpdateProductRequest } from '@/types/product';
import type { QueryParams } from '@/types/api';

interface ProductsState {
  products: IProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
}

export function useProducts() {
  const [state, setState] = useState<ProductsState>({
    products: [],
    pagination: null,
    isLoading: false,
    error: null,
  });

  const fetchProducts = useCallback(async (query: QueryParams = {}) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const params = new URLSearchParams();
      if (query.page) params.set('page', String(query.page));
      if (query.limit) params.set('limit', String(query.limit));
      if (query.search) params.set('search', query.search);
      if (query.sort) params.set('sort', query.sort);
      if (query.order) params.set('order', query.order);
      if (query.category) params.set('category', query.category);
      if (query.minPrice !== undefined) params.set('minPrice', String(query.minPrice));
      if (query.maxPrice !== undefined) params.set('maxPrice', String(query.maxPrice));

      const { data } = await apiClient.get(`/products?${params.toString()}`);

      if (data.success) {
        setState({
          products: data.data,
          pagination: data.pagination,
          isLoading: false,
          error: null,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  const createProduct = useCallback(async (productData: CreateProductRequest) => {
    const { data } = await apiClient.post('/products', productData);
    return data;
  }, []);

  const updateProduct = useCallback(async (id: string, productData: UpdateProductRequest) => {
    const { data } = await apiClient.put(`/products/${id}`, productData);
    return data;
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const { data } = await apiClient.delete(`/products/${id}`);
    return data;
  }, []);

  const getProduct = useCallback(async (id: string) => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  }, []);

  return {
    ...state,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  };
}
