export type DeliveryStatus =
  | "WAITING_FOR_DRIVER"
  | "ASSIGNED"
  | "PICKED_UP"
  | "DELIVERED";

export interface Delivery {
  id: string;
  orderId: string;
  driverId?: string;
  status: DeliveryStatus;
  fee: number;
  pickedUpAt?: string;
  deliveredAt?: string;
  createdAt: string;
  order: {
    id: string;
    status: string;
    totalAmount: number;
    store: {
      id: string;
      name: string;
      slug: string;
    };
    address: {
      recipientName: string;
      phone: string;
      street: string;
      city: string;
      province: string;
      postalCode: string;
    };
    items: {
      id: string;
      productName: string;
      quantity: number;
    }[];
  };
}

export interface DriverEarnings {
  totalEarnings: number;
  completedDeliveries: number;
  balance: number;
  recentEarnings: {
    id: string;
    amount: number;
    description: string;
    createdAt: string;
  }[];
}