import { Shop, Product, ServiceItem, AuthResponse, EventItem, User, Comment } from "@/types";

const API_BASE_URL = "http://localhost:8085/api";

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isPublicEndpoint = endpoint.startsWith("/public/") || endpoint.startsWith("/auth/");

  // Debug logging for admin endpoints
  if (endpoint.startsWith("/admin/")) {
    console.log(`[API Debug] Endpoint: ${endpoint}`);
    console.log(`[API Debug] Token exists: ${!!token}`);
    console.log(`[API Debug] Token preview: ${token ? token.substring(0, 20) + "..." : "none"}`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(!isPublicEndpoint && token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        console.error(`[API Error] 401 Unauthorized on ${endpoint}`);
        // Redirect to login after a short delay to allow error to be seen
        if (endpoint.startsWith("/admin/")) {
          console.error("[API Error] Admin access denied - redirecting to login...");
          setTimeout(() => {
            window.location.href = "/login?error=unauthorized";
          }, 2000);
        }
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`[API Error] Fetch failed for ${endpoint}:`, error);
    throw error; // Re-throw to ensure caller gets the error
  }
}

export const api = {
  auth: {
    login: (data: any) => fetcher<{ token: string; id: number; username: string; email: string; roles: string[] }>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    signup: (data: any) => fetcher<{ message: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  },

  shops: {
    getAll: () => fetcher<Shop[]>("/public/shops"),
    getById: (id: number) => fetcher<Shop>(`/public/shops/${id}`),
    getPopular: () => fetcher<Shop[]>("/public/shops/popular"),
    getPromotions: () => fetcher<Shop[]>("/public/shops/promotions"),
    getNearby: (lat: number, lng: number) => fetcher<Shop[]>(`/public/shops/nearby?lat=${lat}&lng=${lng}`),
    getMyShop: () => fetcher<Shop>("/shops/my-shop"),
  },

  products: {
    getAll: () => fetcher<Product[]>("/public/products"),
    getById: (id: number) => fetcher<Product>(`/public/products/${id}`),
    getPopular: () => fetcher<Product[]>("/public/products/popular"),
    getPromotions: () => fetcher<Product[]>("/public/products/promotions"),
    getByCategory: (category: string) => fetcher<Product[]>(`/public/products/category/${category}`),
    getByShop: (shopId: number) => fetcher<Product[]>(`/public/products/shop/${shopId}`),
  },

  services: {
    getAll: () => fetcher<ServiceItem[]>("/public/services"),
    getById: (id: number) => fetcher<ServiceItem>(`/public/services/${id}`),
    getPopular: () => fetcher<ServiceItem[]>("/public/services/popular"),
    getPromotions: () => fetcher<ServiceItem[]>("/public/services/promotions"),
    getByShop: (shopId: number) => fetcher<ServiceItem[]>(`/public/services/shop/${shopId}`),
  },

  events: {
    getAll: () => fetcher<EventItem[]>("/public/events"),
    getById: (id: number) => fetcher<EventItem>(`/public/events/${id}`),
    getByShop: (shopId: number) => fetcher<EventItem[]>(`/public/events/shop/${shopId}`),
    getMyEvents: () => fetcher<EventItem[]>("/events/my-events"),
    getMyUpcomingEvents: () => fetcher<EventItem[]>("/events/my-events/upcoming"),
    getComments: (eventId: number) => fetcher<Comment[]>(`/events/${eventId}/comments`),
    addComment: (eventId: number, data: any) => fetcher<Comment>(`/events/${eventId}/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  },

  public: {
    users: {
      me: () => fetcher<any>("/public/users/me"),
    },
  },

  promotions: {
    getAll: () => fetcher<any[]>("/promotions"),
    getById: (id: number) => fetcher<any>(`/promotions/${id}`),
    getMyPromotions: () => fetcher<any[]>("/promotions/my-promotions"),
    getMyActivePromotions: () => fetcher<any[]>("/promotions/my-promotions/active"),
    getByShop: (shopId: number) => fetcher<any[]>(`/promotions/shop/${shopId}`),
    create: (data: any) => fetcher<{ message: string }>("/promotions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => fetcher<{ message: string }>(`/promotions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetcher<{ message: string }>(`/promotions/${id}`, {
      method: "DELETE",
    }),
    updateStatus: (id: number, status: string) => fetcher<{ message: string }>(`/promotions/${id}/status?status=${status}`, {
      method: "PUT",
    }),
    validateCode: (code: string, shopId?: number) => fetcher<any>(`/promotions/validate-code?code=${code}${shopId ? `&shopId=${shopId}` : ""}`, {
      method: "POST",
    }),
  },

  stock: {
    getMyProducts: () => fetcher<any[]>("/products/my-products"),
    getLowStock: () => fetcher<any[]>("/products/my-products/low-stock"),
    updateStock: (id: number, quantity: number) => fetcher<{ message: string }>(`/products/${id}/stock?quantity=${quantity}`, {
      method: "PUT",
    }),
    updateThreshold: (id: number, threshold: number) => fetcher<{ message: string }>(`/products/${id}/stock-threshold?threshold=${threshold}`, {
      method: "PUT",
    }),
    getSummary: () => fetcher<{ totalProducts: number; criticalStock: number; lowStock: number; healthyStock: number }>("/products/my-products/stock-summary"),
  },

  staff: {
    getAll: () => fetcher<User[]>("/staff"),
    create: (shopId: number, data: any) => fetcher<User>(`/staff/shops/${shopId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => fetcher<User>(`/staff/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetcher<void>(`/staff/${id}`, {
      method: "DELETE",
    }),
  },

  admin: {
    getStats: () => fetcher<any>("/admin/stats"),
    users: {
      getAll: () => fetcher<User[]>("/admin/users"),
      getById: (id: number) => fetcher<User>(`/admin/users/${id}`),
      updateRoles: (id: number, roles: string[]) => fetcher(`/admin/users/${id}/roles`, {
        method: "PUT",
        body: JSON.stringify(roles),
      }),
    },
    getUsers: () => fetcher<any[]>("/admin/users"),
    getUserById: (id: number) => fetcher<any>(`/admin/users/${id}`),
    updateUserStatus: (id: number, status: string) => fetcher<any>(`/admin/users/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
    deleteUser: (id: number) => fetcher<any>(`/admin/users/${id}`, {
      method: "DELETE",
    }),
    updateUserRole: (id: number, role: string) => fetcher<any>(`/admin/users/${id}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    }),
    getSellers: () => fetcher<any[]>("/admin/users/sellers"),
    getServiceProviders: () => fetcher<any[]>("/admin/users/service-providers"),
    getCustomers: () => fetcher<any[]>("/admin/users/customers"),
    getPendingShops: () => fetcher<Shop[]>("/admin/shops/pending"),
    getAllShops: () => fetcher<Shop[]>("/admin/shops"),
    getShopById: (id: number) => fetcher<Shop>(`/admin/shops/${id}`),
    deleteShop: (id: number) => fetcher<any>(`/admin/shops/${id}`, {
      method: "DELETE",
    }),
    updateShopStatus: (id: number, status: string) => fetcher<any>(`/admin/shops/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  },
};
