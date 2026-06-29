import api from "./api";
import { Voucher, Promo } from "../types/voucherTypes";

export const voucherService = {
  getActiveVouchers: async (): Promise<Voucher[]> => {
    const res = await api.get<{ data: Voucher[] }>("/vouchers/active");
    return res.data.data;
  },

  validateVoucher: async (
    code: string,
    orderAmount: number
  ): Promise<{ voucher: Voucher; discount: number }> => {
    const res = await api.post("/vouchers/validate", { code, orderAmount });
    return res.data.data;
  },

  getActivePromos: async (): Promise<Promo[]> => {
    const res = await api.get<{ data: Promo[] }>("/vouchers/promos/active");
    return res.data.data;
  },
};