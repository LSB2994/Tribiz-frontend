export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  location?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  location?: string;
}

export interface Shop {
  id: number;
  name: string;
  location: string;
  contactInfo: string;
  isOpen: boolean;
  description?: string;
  image?: string;
  status: string;
  rating?: number;
  reviewCount?: number;
  latitude?: number;
  longitude?: number;

  owner?: User;
}

export interface EventItem {
  id: number;
  title: string;
  description: string;
  image?: string;
  startDate: string;

  endDate: string;
  location: string;
  shopId?: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  imageUrl?: string; // For dashboard consistency
  status: string;
  barcode: string;
  category: string;
  discount: number;
  buyOneGetOne: boolean;
  stock: number; // For dashboard consistency
  shop?: Shop;
  shopId?: number;
  shopName?: string;
  rating?: number;
  reviewCount?: number;
}

export interface ServiceItem {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  image?: string;
  duration?: number; // For dashboard consistency

  status: string;
  location?: string; // For dashboard consistency
  shop?: Shop;
  shopId?: number;
  shopName?: string;
  rating?: number;
  reviewCount?: number;
  discount?: number;
}

export interface Comment {
  id: number;
  content: string;
  authorName: string;
  authorAvatar: string | null;
  createdAt: string;
}
