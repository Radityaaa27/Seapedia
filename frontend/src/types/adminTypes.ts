export interface AdminOverview {
  stats: {
    totalUsers: number;
    totalStores: number;
    totalProducts: number;
    totalOrders: number;
    newUsersThisMonth: number;
    newOrdersThisMonth: number;
    totalRevenue: number;
    thisMonthRevenue: number;
  };
  ordersByStatus: {
    status: string;
    _count: { id: number };
  }[];
  recentOrders: any[];
  recentUsers: any[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  roles: { role: string; isActive: boolean }[];
  _count: { ordersAsBuyer: number };
}