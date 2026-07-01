export interface Store {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  products?: StoreProduct[];
}

export interface StoreProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  isActive: boolean;
  images: { url: string; isPrimary: boolean }[];
}

export interface CreateStoreInput {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateStoreInput {
  name?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
}