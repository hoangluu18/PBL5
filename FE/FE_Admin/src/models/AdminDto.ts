// src/types/dashboard.ts
export interface ShopRevenue {
    name: string;
    revenue: number;
}

export interface ShopStatistic {
    id: string;
    shopName: string;
    totalOrders: number;
    completedOrders: number;
    canceledOrders: number;
    failedOrders: number;
    completionRate: number;
    revenue: number;
}

export interface Shop {
    id: string;
    name: string;
    description: string;
    enabled: boolean; // Changed from status to enabled (boolean)
    address: string;
    photo: string;
    rating: number;
    productAmount: number;
    peopleTracking: number;
    phone: string | null; // Make phone nullable to match backend
    city: string;
    email?: string; // Optional since it's not in your example
    createdAt?: string; // Optional since it's not in your example
}