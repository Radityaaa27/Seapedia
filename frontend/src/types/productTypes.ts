export interface Category {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  weight: number;
  isActive: boolean;
  category: Category;
  images: ProductImage[];
  store?: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  };
  reviews?: Review[];
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  weight: number;
  categoryId: string;
  images: { url: string; isPrimary: boolean }[];
}