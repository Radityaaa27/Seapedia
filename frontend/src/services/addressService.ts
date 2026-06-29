import api from "./api";
import { Address, AddressInput } from "../types/addressTypes";

export const addressService = {
  getAddresses: async (): Promise<Address[]> => {
    const res = await api.get<{ data: Address[] }>("/addresses");
    return res.data.data;
  },

  createAddress: async (input: AddressInput): Promise<Address> => {
    const res = await api.post<{ data: Address }>("/addresses", input);
    return res.data.data;
  },

  updateAddress: async (
    id: string,
    input: Partial<AddressInput>
  ): Promise<Address> => {
    const res = await api.put<{ data: Address }>(`/addresses/${id}`, input);
    return res.data.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },

  setDefault: async (id: string): Promise<Address> => {
    const res = await api.patch<{ data: Address }>(`/addresses/${id}/default`);
    return res.data.data;
  },
};