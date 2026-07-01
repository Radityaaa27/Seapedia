import api from "./api";
import { AdminOverview, AdminUser } from "../types/adminTypes";

export const adminService = {
  getOverview: async (): Promise<AdminOverview> => {
    const res = await api.get<{ data: AdminOverview }>("/admin/overview");
    return res.data.data;
  },

  getUsers: async (
    page = 1,
    search?: string
  ): Promise<{ data: AdminUser[]; meta: any }> => {
    const res = await api.get("/admin/users", {
      params: { page, ...(search && { search }) },
    });
    return res.data;
  },

  toggleUserActive: async (userId: string): Promise<AdminUser> => {
    const res = await api.patch<{ data: AdminUser }>(
      `/admin/users/${userId}/toggle`
    );
    return res.data.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },

  assignRole: async (userId: string, role: string) => {
    const res = await api.post(`/admin/users/${userId}/roles`, { role });
    return res.data.data;
  },

  getOverdueOrders: async () => {
    const res = await api.get("/admin/orders/overdue");
    return res.data.data;
  },

  forceCancelOrder: async (orderId: string) => {
    const res = await api.patch(`/admin/orders/${orderId}/force-cancel`);
    return res.data.data;
  },

  createVoucher: async (data: any) => {
    const res = await api.post("/admin/vouchers", data);
    return res.data.data;
  },

  getVouchers: async () => {
    const res = await api.get("/admin/vouchers");
    return res.data.data;
  },

  toggleVoucher: async (id: string) => {
    const res = await api.patch(`/admin/vouchers/${id}/toggle`);
    return res.data.data;
  },

  createPromo: async (data: any) => {
    const res = await api.post("/admin/promos", data);
    return res.data.data;
  },

  getPromos: async () => {
    const res = await api.get("/admin/promos");
    return res.data.data;
  },

  togglePromo: async (id: string) => {
    const res = await api.patch(`/admin/promos/${id}/toggle`);
    return res.data.data;
  },
  runOverdueCheck: async () => {
    const res = await api.post("/admin/orders/run-overdue-check");
    return res.data.data;
  },
};