import api from "./api";
import { Order, CreateOrderInput } from "../types/orderTypes";

export const orderService = {
  createOrder: async (input: CreateOrderInput): Promise<Order> => {
    const res = await api.post<{ data: Order }>("/orders", input);
    return res.data.data;
  },

  getMyOrders: async (page = 1): Promise<{ data: Order[]; meta: any }> => {
    const res = await api.get("/orders", { params: { page } });
    return res.data;
  },

  getOrderDetail: async (id: string): Promise<Order> => {
    const res = await api.get<{ data: Order }>(`/orders/${id}`);
    return res.data.data;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const res = await api.patch<{ data: Order }>(`/orders/${id}/cancel`);
    return res.data.data;
  },

  getSellerOrders: async (page = 1): Promise<{ data: Order[]; meta: any }> => {
    const res = await api.get("/orders/seller/orders", { params: { page } });
    return res.data;
  },

  processOrder: async (id: string): Promise<Order> => {
    const res = await api.patch<{ data: Order }>(`/orders/${id}/process`);
    return res.data.data;
  },

  markReadyForPickup: async (id: string): Promise<Order> => {
    const res = await api.patch<{ data: Order }>(`/orders/${id}/ready`);
    return res.data.data;
  },
};