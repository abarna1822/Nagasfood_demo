import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  SEED_INQUIRIES,
  SEED_ORDERS,
  SEED_PRODUCTS,
  SEED_SETTINGS,
  SEED_TESTIMONIALS,
} from '../data/seedData';
import type {
  CartItem,
  HeroMediaConfig,
  Inquiry,
  Order,
  OrderStage,
  Product,
  SiteSettings,
  Testimonial,
} from '../types/commerce';
import { normalizePhone } from '../utils/commerce';

const STORAGE_KEYS = {
  products: 'nagas_foods_v1_products',
  cart: 'nagas_foods_v1_cart',
  orders: 'nagas_foods_v1_orders',
  testimonials: 'nagas_foods_v1_testimonials',
  inquiries: 'nagas_foods_v1_inquiries',
  settings: 'nagas_foods_v1_settings',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

interface StoreContextValue {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  testimonials: Testimonial[];
  inquiries: Inquiry[];
  settings: SiteSettings;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, format: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, format: string, delta: number) => void;
  removeFromCart: (productId: string, format: string) => void;
  clearCart: () => void;
  placeOrder: (order: Order) => void;
  updateOrderStage: (orderId: string, stage: OrderStage) => void;
  findOrdersByPhone: (phone: string) => Order[];
  upsertProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  toggleProductSoldOut: (productId: string) => void;
  addTestimonial: (t: Omit<Testimonial, 'id' | 'createdAt'>) => void;
  deleteTestimonial: (id: string) => void;
  addInquiry: (inq: Omit<Inquiry, 'id' | 'createdAt' | 'read'>) => void;
  toggleInquiryRead: (id: string) => void;
  updateSettings: (partial: Partial<SiteSettings>) => void;
  updateHeroMedia: (partial: Partial<HeroMediaConfig>) => void;
  exportAllData: () => string;
  importAllData: (jsonText: string) => { ok: boolean; error?: string };
  resetAllData: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    readStorage(STORAGE_KEYS.products, SEED_PRODUCTS)
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    readStorage(STORAGE_KEYS.cart, [])
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    readStorage(STORAGE_KEYS.orders, SEED_ORDERS)
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() =>
    readStorage(STORAGE_KEYS.testimonials, SEED_TESTIMONIALS)
  );
  const [inquiries, setInquiries] = useState<Inquiry[]>(() =>
    readStorage(STORAGE_KEYS.inquiries, SEED_INQUIRIES)
  );
  const [settings, setSettings] = useState<SiteSettings>(() =>
    readStorage(STORAGE_KEYS.settings, SEED_SETTINGS)
  );
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => writeStorage(STORAGE_KEYS.products, products), [products]);
  useEffect(() => writeStorage(STORAGE_KEYS.cart, cart), [cart]);
  useEffect(() => writeStorage(STORAGE_KEYS.orders, orders), [orders]);
  useEffect(() => writeStorage(STORAGE_KEYS.testimonials, testimonials), [testimonials]);
  useEffect(() => writeStorage(STORAGE_KEYS.inquiries, inquiries), [inquiries]);
  useEffect(() => writeStorage(STORAGE_KEYS.settings, settings), [settings]);

  const addToCart = (product: Product, format: string, quantity = 1) => {
    if (product.soldOut) return;
    const variant =
      product.variants.find((v) => v.format === format) ?? product.variants[0];
    if (!variant) return;

    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.productId === product.id && item.format === variant.format
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          format: variant.format,
          unitPrice: variant.price,
          quantity,
          imageUrl: product.imageUrl,
        },
      ];
    });
  };

  const updateCartQuantity = (productId: string, format: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId && item.format === format
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string, format: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.format === format)
      )
    );
  };

  const clearCart = () => setCart([]);

  const placeOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
  };

  const updateOrderStage = (orderId: string, stage: OrderStage) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, stage } : o))
    );
  };

  const findOrdersByPhone = (phone: string): Order[] => {
    const target = normalizePhone(phone);
    if (!target) return [];
    return orders.filter(
      (o) => normalizePhone(o.customer.phone) === target
    );
  };

  const upsertProduct = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      }
      return [product, ...prev];
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const toggleProductSoldOut = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, soldOut: !p.soldOut } : p))
    );
  };

  const addTestimonial = (t: Omit<Testimonial, 'id' | 'createdAt'>) => {
    const next: Testimonial = {
      ...t,
      id: `tm-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTestimonials((prev) => [next, ...prev]);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const addInquiry = (inq: Omit<Inquiry, 'id' | 'createdAt' | 'read'>) => {
    const next: Inquiry = {
      ...inq,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setInquiries((prev) => [next, ...prev]);
  };

  const toggleInquiryRead = (id: string) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, read: !i.read } : i))
    );
  };

  const updateSettings = (partial: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const updateHeroMedia = (partial: Partial<HeroMediaConfig>) => {
    setSettings((prev) => ({
      ...prev,
      heroMedia: { ...prev.heroMedia, ...partial },
    }));
  };

  const exportAllData = (): string => {
    return JSON.stringify(
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        products,
        orders,
        testimonials,
        inquiries,
        settings,
      },
      null,
      2
    );
  };

  const importAllData = (jsonText: string): { ok: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed || typeof parsed !== 'object') {
        return { ok: false, error: 'Invalid JSON structure.' };
      }
      if (Array.isArray(parsed.products)) setProducts(parsed.products);
      if (Array.isArray(parsed.orders)) setOrders(parsed.orders);
      if (Array.isArray(parsed.testimonials)) setTestimonials(parsed.testimonials);
      if (Array.isArray(parsed.inquiries)) setInquiries(parsed.inquiries);
      if (parsed.settings && typeof parsed.settings === 'object') {
        setSettings(parsed.settings);
      }
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Failed to parse JSON.',
      };
    }
  };

  const resetAllData = () => {
    setProducts(SEED_PRODUCTS);
    setOrders(SEED_ORDERS);
    setTestimonials(SEED_TESTIMONIALS);
    setInquiries(SEED_INQUIRIES);
    setSettings(SEED_SETTINGS);
    setCart([]);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        testimonials,
        inquiries,
        settings,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        updateOrderStage,
        findOrdersByPhone,
        upsertProduct,
        deleteProduct,
        toggleProductSoldOut,
        addTestimonial,
        deleteTestimonial,
        addInquiry,
        toggleInquiryRead,
        updateSettings,
        updateHeroMedia,
        exportAllData,
        importAllData,
        resetAllData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useNagasStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useNagasStore must be used inside StoreProvider');
  }
  return ctx;
}
