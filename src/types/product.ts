export interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  imageUrl?: string;
}
