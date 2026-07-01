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
  | "REFUNDED"
  | "RETURNED";

export type DeliveryMethod = "INSTANT" | "NEXT_DAY" | "REGULAR";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImg?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderStatusHistoryEntry {
  id: string;
  status: OrderStatus;
  note?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  storeId: string;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
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
  statusHistory: OrderStatusHistoryEntry[];
}

export interface CreateOrderInput {
  addressId: string;
  storeId: string;
  deliveryMethod: DeliveryMethod;
  items: {
    cartItemId: string;
    productId: string;
    quantity: number;
  }[];
  voucherId?: string;
  notes?: string;
}