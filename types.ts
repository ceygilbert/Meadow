
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
  on_list?: boolean;
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
  additional_details?: string;
  ddr_type?: 'DDR4' | 'DDR5' | '';
  specs: Record<string, string>;
  is_custom_build: boolean;
  is_customised: boolean;
  is_featured: boolean;
  is_Promo: boolean;
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

export interface HeroBanner {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  link?: string;
  button_text?: string;
  is_active: boolean;
}

export interface FeaturedCategorySetting {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  is_active: boolean;
  order?: number;
}

export interface HomePageSettings {
  id?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_bg_text?: string;
  banners: HeroBanner[];
  categories: FeaturedCategorySetting[];
  custom_pc_title?: string;
  custom_pc_subtitle?: string;
  custom_pc_btn_text?: string;
  custom_pc_btn_link?: string;
  custom_pc_bg_image?: string;
  // Visit Our Store Section
  store_section_title?: string;
  store_card_title?: string;
  store_btn_text?: string;
  store_btn_link?: string;
  store_video_label?: string;
  store_media_url?: string;
  store_media_type?: 'video' | 'image';
  updated_at?: string;
}

export interface AwardCardItem {
  id: string;
  company: string;
  type: string;
  logo_url?: string;
  awards: string[];
  duration: string;
}

export interface OurStorySettings {
  id?: string;
  // Hero Section
  hero_eyebrow?: string;
  hero_title?: string;
  hero_paragraph_1?: string;
  hero_paragraph_2?: string;
  hero_paragraph_3?: string;
  hero_image_url?: string;

  // Foundations Section
  foundations_eyebrow?: string;
  foundations_title?: string;
  foundations_feature1_title?: string;
  foundations_feature1_desc?: string;
  foundations_feature2_title?: string;
  foundations_feature2_desc?: string;
  foundations_image_url?: string;

  // Distribution / Locations Section
  locations_eyebrow?: string;
  locations_title?: string;
  locations_desc?: string;
  locations_btn_text?: string;
  locations_btn_link?: string;
  locations_image_url?: string;

  // Multi-Award Section
  awards_section_title?: string;
  awards_section_desc?: string;
  awards_tag_label?: string;
  award_cards: AwardCardItem[];

  // Commitment / Values Section
  commitment_eyebrow?: string;
  commitment_quote?: string;
  val1_title?: string;
  val1_desc?: string;
  val2_title?: string;
  val2_desc?: string;
  val3_title?: string;
  val3_desc?: string;

  updated_at?: string;
}


