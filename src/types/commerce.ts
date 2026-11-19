export type ProductCategory = 'dates' | 'honey' | 'dry-fruits';

export interface ProductVariant {
  format: string; // e.g., "100g Pouch", "100g Box", "200g Box", "Container (400g)"
  price: number;  // INR
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  origin: string;
  tastingNote: string;
  description: string;
  imageUrl: string;
  imageFocus?: string;
  variants: ProductVariant[];
  soldOut: boolean;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  format: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
}

export type OrderStage = 'Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered';

export type PaymentMethod = 'UPI' | 'Card' | 'Netbanking' | 'Wallets' | 'Cash on Delivery';

export interface ShippingDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  deliveryNote?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: ShippingDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  stage: OrderStage;
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  itemBought: string;
  quote: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface HeroMediaConfig {
  mode: 'video' | 'image';
  imageUrl: string;
  videoUrl: string;
  isCustomUploaded: boolean;
}

export interface SiteSettings {
  whatsappNumber: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  announcementText: string;
  heroMedia: HeroMediaConfig;
}

export type BackendMode = 'supabase' | 'local-json';

export type AppView =
  | 'home'
  | 'about'
  | 'products'
  | 'testimonials'
  | 'visit'
  | 'orders'
  | 'contact'
  | 'admin';

export interface ValidationErrors {
  [field: string]: string;
}
