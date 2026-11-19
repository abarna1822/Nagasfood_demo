import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  SEED_INQUIRIES,
  SEED_ORDERS,
  SEED_PRODUCTS,
  SEED_SETTINGS,
  SEED_TESTIMONIALS,
} from '../data/seedData';
import type {
  BackendMode,
  CartItem,
  HeroMediaConfig,
  Inquiry,
  Order,
  OrderStage,
  PaymentMethod,
  Product,
  ShippingDetails,
  SiteSettings,
  Testimonial,
} from '../types/commerce';
import { normalizePhone } from '../utils/commerce';

const CART_STORAGE_KEY = 'nagas_foods_v1_cart';
const ADMIN_TOKEN_KEY = 'nagas_foods_v1_admin_token';

function readCartStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCartStorage(cart: CartItem[]): void {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Ignore quota errors
  }
}

function readSessionToken(): string {
  try {
    return window.sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function writeSessionToken(token: string): void {
  try {
    if (token) {
      window.sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

interface StoreContextValue {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  testimonials: Testimonial[];
  inquiries: Inquiry[];
  settings: SiteSettings;
  backendMode: BackendMode;
  loading: boolean;
  adminToken: string;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  refreshFromServer: () => Promise<void>;
  loginAdmin: (passcode: string) => Promise<{ ok: boolean; error?: string }>;
  logoutAdmin: () => void;
  addToCart: (product: Product, format: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, format: string, delta: number) => void;
  removeFromCart: (productId: string, format: string) => void;
  clearCart: () => void;
  placeOrder: (payload: {
    customer: ShippingDetails;
    items: CartItem[];
    paymentMethod: PaymentMethod;
  }) => Promise<Order>;
  updateOrderStage: (orderId: string, stage: OrderStage) => Promise<void>;
  findOrdersByPhone: (phone: string) => Order[];
  upsertProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  toggleProductSoldOut: (productId: string) => Promise<void>;
  addTestimonial: (t: Omit<Testimonial, 'id' | 'createdAt'>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  addInquiry: (inq: Omit<Inquiry, 'id' | 'createdAt' | 'read'>) => Promise<void>;
  toggleInquiryRead: (id: string) => Promise<void>;
  updateSettings: (partial: Partial<SiteSettings>) => Promise<void>;
  updateHeroMedia: (partial: Partial<HeroMediaConfig>) => Promise<void>;
  exportAllData: () => string;
  importAllData: (jsonText: string) => Promise<{ ok: boolean; error?: string }>;
  resetAllData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => readCartStorage());
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(SEED_TESTIMONIALS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(SEED_INQUIRIES);
  const [settings, setSettings] = useState<SiteSettings>(SEED_SETTINGS);
  const [backendMode, setBackendMode] = useState<BackendMode>('local-json');
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState<string>(() => readSessionToken());
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    writeCartStorage(cart);
  }, [cart]);

  const refreshFromServer = async () => {
    try {
      const res = await fetch('/api/bootstrap');
      if (!res.ok) throw new Error('Bootstrap fetch failed');
      const data = await res.json();
      if (Array.isArray(data.products)) setProducts(data.products);
      if (Array.isArray(data.orders)) setOrders(data.orders);
      if (Array.isArray(data.testimonials)) setTestimonials(data.testimonials);
      if (Array.isArray(data.inquiries)) setInquiries(data.inquiries);
      if (data.settings) setSettings(data.settings);
      if (data.backendMode) setBackendMode(data.backendMode);
    } catch {
      // Keep seed fallback cleanly if offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshFromServer();
  }, []);

  const authHeaders = (): Record<string, string> => ({
    'Content-Type': 'application/json',
    ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
  });

  const loginAdmin = async (
    passcode: string
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error || 'Incorrect passcode.' };
      }
      setAdminToken(data.token);
      writeSessionToken(data.token);
      if (data.backendMode) setBackendMode(data.backendMode);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Unable to reach verification server.' };
    }
  };

  const logoutAdmin = () => {
    setAdminToken('');
    writeSessionToken('');
  };

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

  const placeOrder = async (payload: {
    customer: ShippingDetails;
    items: CartItem[];
    paymentMethod: PaymentMethod;
  }): Promise<Order> => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.order) {
      throw new Error(data.error || 'Could not place order.');
    }
    const created = data.order as Order;
    setOrders((prev) => [created, ...prev]);
    setCart([]);
    return created;
  };

  const updateOrderStage = async (orderId: string, stage: OrderStage) => {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/stage`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ stage }),
    });
    if (res.status === 401) {
      logoutAdmin();
      return;
    }
    const data = await res.json();
    if (res.ok && Array.isArray(data.orders)) {
      setOrders(data.orders);
    }
  };

  const findOrdersByPhone = (phone: string): Order[] => {
    const target = normalizePhone(phone);
    if (!target) return [];
    return orders.filter(
      (o) => normalizePhone(o.customer.phone) === target
    );
  };

  const upsertProduct = async (product: Product) => {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(product),
    });
    if (res.status === 401) {
      logoutAdmin();
      return;
    }
    const data = await res.json();
    if (res.ok && Array.isArray(data.products)) {
      setProducts(data.products);
    }
  };

  const deleteProduct = async (productId: string) => {
    const res = await fetch(`/api/admin/products/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.status === 401) {
      logoutAdmin();
      return;
    }
    const data = await res.json();
    if (res.ok && Array.isArray(data.products)) {
      setProducts(data.products);
    }
  };

  const toggleProductSoldOut = async (productId: string) => {
    const res = await fetch(
      `/api/admin/products/${encodeURIComponent(productId)}/sold-out`,
      {
        method: 'PATCH',
        headers: authHeaders(),
      }
    );
    if (res.status === 401) {
      logoutAdmin();
      return;
    }
    const data = await res.json();
    if (res.ok && Array.isArray(data.products)) {
      setProducts(data.products);
    }
  };

  const addTestimonial = async (t: Omit<Testimonial, 'id' | 'createdAt'>) => {
    const res = await fetch('/api/admin/testimonials', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(t),
    });
    if (res.status === 401) {
      logoutAdmin();
      return;
    }
    const data = await res.json();
    if (res.ok && Array.isArray(data.testimonials)) {
      setTestimonials(data.testimonials);
    }
  };

  const deleteTestimonial = async (id: string) => {
    const res = await fetch(`/api/admin/testimonials/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.status === 401) {
      logoutAdmin();
      return;
    }
    const data = await res.json();
    if (res.ok && Array.isArray(data.testimonials)) {
      setTestimonials(data.testimonials);
    }
  };

  const addInquiry = async (inq: Omit<Inquiry, 'id' | 'createdAt' | 'read'>) => {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inq),
    });
    const data = await res.json();
    if (res.ok && data.inquiry) {
      setInquiries((prev) => [data.inquiry as Inquiry, ...prev]);
    }
  };

  const toggleInquiryRead = async (id: string) => {
    const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(id)}/read`, {
      method: 'PATCH',
      headers: authHeaders(),
    });
    if (res.status === 401) {
      logoutAdmin();
      return;
    }
    const data = await res.json();
    if (res.ok && Array.isArray(data.inquiries)) {
      setInquiries(data.inquiries);
    }
  };

  const updateSettings = async (partial: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(partial),
    });
    if (res.status === 401) {
      logoutAdmin();
      return;
    }
    const data = await res.json();
    if (res.ok && data.settings) {
      setSettings(data.settings);
    }
  };

  const updateHeroMedia = async (partial: Partial<HeroMediaConfig>) => {
    const nextHero = { ...settings.heroMedia, ...partial };
    setSettings((prev) => ({ ...prev, heroMedia: nextHero }));
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ heroMedia: nextHero }),
    });
    if (res.status === 401) {
      logoutAdmin();
      return;
    }
    const data = await res.json();
    if (res.ok && data.settings) {
      setSettings(data.settings);
    }
  };

  const exportAllData = (): string => {
    return JSON.stringify(
      {
        version: 2,
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

  const importAllData = async (
    jsonText: string
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const parsed = JSON.parse(jsonText);
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error || 'Import failed.' };
      }
      if (data.snapshot) {
        setProducts(data.snapshot.products);
        setOrders(data.snapshot.orders);
        setTestimonials(data.snapshot.testimonials);
        setInquiries(data.snapshot.inquiries);
        setSettings(data.snapshot.settings);
      }
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Failed to parse JSON.',
      };
    }
  };

  const resetAllData = async () => {
    const res = await fetch('/api/admin/reset', {
      method: 'POST',
      headers: authHeaders(),
    });
    const data = await res.json();
    if (res.ok && data.snapshot) {
      setProducts(data.snapshot.products);
      setOrders(data.snapshot.orders);
      setTestimonials(data.snapshot.testimonials);
      setInquiries(data.snapshot.inquiries);
      setSettings(data.snapshot.settings);
      setCart([]);
    }
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
        backendMode,
        loading,
        adminToken,
        isCartOpen,
        setIsCartOpen,
        refreshFromServer,
        loginAdmin,
        logoutAdmin,
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
