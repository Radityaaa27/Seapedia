export interface DeliveryJob {
  id: string;
  orderId: string;
  driverId: string | null;
  status: "WAITING_FOR_DRIVER" | "ASSIGNED" | "PICKED_UP" | "DELIVERED";
  fee: number;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    status: string;
    subtotal: number;
    deliveryFee: number;
    taxAmount: number;
    totalAmount: number;
    notes?: string;
    createdAt: string;
    store: {
      id: string;
      name: string;
      slug: string;
    };
    address: {
      id: string;
      label: string;
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
      price: number;
      subtotal: number;
    }[];
    buyer?: {
      id: string;
      name: string;
      phone: string | null;
    };
  };
  driver?: {
    id: string;
    name: string;
    phone: string | null;
  } | null;
}

export interface DriverEarnings {
  totalEarnings: number;
  completedJobs: number;
}