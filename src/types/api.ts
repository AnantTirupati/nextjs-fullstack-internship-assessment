export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
