export type VoucherType = "PERCENTAGE" | "FIXED";
export type PromoType = "PERCENTAGE" | "FIXED";

export interface Voucher {
  id: string;
  code: string;
  type: VoucherType;
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface Promo {
  id: string;
  title: string;
  description?: string;
  type: PromoType;
  value: number;
  bannerUrl?: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}