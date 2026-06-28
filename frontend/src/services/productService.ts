import api from "./api";
import { Product, ProductsResponse, CreateProductInput, Category } from "../types/productTypes";

export const productService = {
  getProducts: async (params?: Record<string, string | number>) => {
    const res = await api.get<ProductsResponse>("/products", { params });
    return res.data;
  },

  getProductBySlug: async (storeSlug: string, productSlug: string) => {
    const res = await api.get<{ data: Product }>(`/products/${storeSlug}/${productSlug}`);
    return res.data.data;
  },

  createProduct: async (input: CreateProductInput) => {
    const res = await api.post<{ data: Product }>("/products", input);
    return res.data.data;
  },

  updateProduct: async (id: string, input: Partial<CreateProductInput>) => {
    const res = await api.put<{ data: Product }>(`/products/${id}`, input);
    return res.data.data;
  },

  deleteProduct: async (id: string) => {
    await api.delete(`/products/${id}`);
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await api.get<{ data: Category[] }>("/categories");
    return res.data.data;
  },
};