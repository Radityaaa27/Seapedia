import { Address } from "./addressTypes";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "READY_FOR_PICKUP"
  | "ON_DELIVERY"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImg?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  buyerId: string;
  storeId: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  store: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  };
  address?: Address;
  items: OrderItem[];
  delivery?: {
    id: string;
    status: string;
    fee: number;
    driverId?: string;
  };
}

export interface CreateOrderInput {
  addressId: string;
  storeId: string;
  items: {
    cartItemId: string;
    productId: string;
    quantity: number;
  }[];
  voucherId?: string;
  notes?: string;
}