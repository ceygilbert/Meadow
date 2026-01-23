
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  created_at?: string;
}

export interface Unit {
  id: string;
  name: string;
  created_at?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description: string;
  image_url?: string;
  created_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  subcategory_id?: string;
  brand_id: string;
  unit_id?: string;
  price: number;
  discount_type: 'none' | 'percentage' | 'fixed';
  discount_value: number;
  stock: number;
  image_url: string;
  description: string;
  specs: Record<string, string>;
  is_custom_build: boolean;
  is_customised: boolean;
  is_featured: boolean;
  created_at?: string;
}

export interface StockLog {
  id: string;
  product_id: string;
  change_amount: number;
  previous_stock: number;
  new_stock: number;
  reason: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  avatar_url: string;
  role: 'admin' | 'customer';
  created_at: string;
  total_spent?: number;
  order_count?: number;
}

export interface Order {
  id: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products?: Product;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
}
