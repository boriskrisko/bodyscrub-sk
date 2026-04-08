export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_price: number | null;
  category: string;
  tags: string[];
  weight_grams: number | null;
  ingredients: string | null;
  images: ProductImage[];
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  avg_rating?: number;
  review_count?: number;
}

export interface ProductImage {
  url: string;
  alt: string;
  position: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  email: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  shipping_address: Address | null;
  billing_address: Address | null;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  coupon_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order: number | null;
  max_uses: number | null;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  cover_image: string | null;
  author: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  name: string;
  rating: number;
  text: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}
