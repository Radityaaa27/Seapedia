import api from "./api";
import { CreateStoreInput, UpdateStoreInput, Store } from "../types/storeTypes";

export const storeService = {
  createStore: async (input: CreateStoreInput): Promise<Store> => {
    const res = await api.post<{ data: Store }>("/stores", input);
    return res.data.data;
  },

  getMyStore: async (): Promise<Store> => {
    const res = await api.get<{ data: Store }>("/stores/my/store");
    return res.data.data;
  },

  getStoreBySlug: async (slug: string): Promise<Store> => {
    const res = await api.get<{ data: Store }>(`/stores/${slug}`);
    return res.data.data;
  },

  updateStore: async (input: UpdateStoreInput): Promise<Store> => {
    const res = await api.put<{ data: Store }>("/stores/my/store", input);
    return res.data.data;
  },
};