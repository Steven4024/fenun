export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  image_url: string | null;
  video_url: string | null;
  tags: string[];
  price: number | null;
  stock: number;
  created_at: string;
}

export interface StorePhoto {
  id: string;
  title: string | null;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface Video {
  id: string;
  title: string | null;
  video_url: string;
  created_at: string;
}

export interface Banner {
  id: string;
  title: string | null;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  logo_url: string | null;
  store_photo_url: string | null;
  store_photo_title: string | null;
  whatsapp_number: string;
  slogan: string;
}

export type ProductWithCategory = Product & { category: Category | null };
