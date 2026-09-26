export interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  icon?: string;
  display_order?: number;
  is_active?: boolean;
  parent_id?: string | null;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  quantity?: number;
  category_id: Category;
  images: string[];
  is_new?: boolean;
  created_at?: string;
  updated_at?: string;
}
