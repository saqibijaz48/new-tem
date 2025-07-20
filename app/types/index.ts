// Database types
export interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  language_preference: "en" | "lt";
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_lt: string;
  slug: string;
  created_at: string;
}

export interface Product {
  id: string;
  title_en: string;
  title_lt: string;
  description_en: string;
  description_lt: string;
  price: number;
  stock: number;
  category_id: string;
  image_url: string;
  images: string[];
  sizes?: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  size?: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  order_number?: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  currency: string;
  language: "en" | "lt";
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  notes?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  size?: string;
  product?: Product;
}

export interface Address {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface BlogPost {
  id: string;
  title_en: string;
  title_lt: string;
  content_en: string;
  content_lt: string;
  excerpt_en?: string;
  excerpt_lt?: string;
  featured_image?: string;
  slug: string;
  author_id: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  language: "en" | "lt";
  created_at: string;
}

// Redux state types
export interface RootState {
  cart: CartState;
  auth: AuthState;
  language: LanguageState;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export interface LanguageState {
  current: "en" | "lt";
}

// Component prop types
export interface ProductCardProps {
  product: Product;
  language: "en" | "lt";
}

export interface LanguageSwitcherProps {
  currentLanguage: "en" | "lt";
  onLanguageChange: (language: "en" | "lt") => void;
}
