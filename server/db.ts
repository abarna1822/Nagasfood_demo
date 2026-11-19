import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  SEED_INQUIRIES,
  SEED_ORDERS,
  SEED_PRODUCTS,
  SEED_SETTINGS,
  SEED_TESTIMONIALS,
} from '../src/data/seedData.ts';
import type {
  BackendMode,
  CartItem,
  Inquiry,
  Order,
  OrderStage,
  PaymentMethod,
  Product,
  ShippingDetails,
  SiteSettings,
  Testimonial,
} from '../src/types/commerce.ts';
import {
  calculateDeliveryFee,
  calculateSubtotal,
  generateOrderId,
  normalizePhone,
  ORDER_STAGES,
} from '../src/utils/commerce.ts';

export interface StoreSnapshot {
  products: Product[];
  orders: Order[];
  testimonials: Testimonial[];
  inquiries: Inquiry[];
  settings: SiteSettings;
}

const LOCAL_STORE_PATH = path.resolve(process.cwd(), '.nagas-data.json');

function getDefaultSnapshot(): StoreSnapshot {
  return {
    products: structuredClone(SEED_PRODUCTS),
    orders: structuredClone(SEED_ORDERS),
    testimonials: structuredClone(SEED_TESTIMONIALS),
    inquiries: structuredClone(SEED_INQUIRIES),
    settings: structuredClone(SEED_SETTINGS),
  };
}

function getSupabaseCredentials(): { url: string; key: string } | null {
  const url = (process.env.SUPABASE_URL || '').trim();
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim();
  if (!url || !key) return null;
  return { url, key };
}

interface ProductRow {
  id: string;
  name: string;
  category: Product['category'];
  origin: string;
  tasting_note: string;
  description: string;
  image_url: string;
  image_focus: string | null;
  variants: Product['variants'];
  sold_out: boolean;
  featured: boolean | null;
  sort_order?: number | null;
}

interface OrderRow {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer: ShippingDetails;
  items: CartItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  stage: OrderStage;
}

interface TestimonialRow {
  id: string;
  author: string;
  location: string;
  item_bought: string;
  quote: string;
  created_at: string;
}

interface InquiryRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}

interface SettingsRow {
  id: string;
  whatsapp_number: string;
  delivery_fee: number;
  free_delivery_threshold: number;
  announcement_text: string;
  hero_media: SiteSettings['heroMedia'];
}

function mapProductFromRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    origin: row.origin,
    tastingNote: row.tasting_note,
    description: row.description,
    imageUrl: row.image_url,
    imageFocus: row.image_focus ?? undefined,
    variants: Array.isArray(row.variants) ? row.variants : [],
    soldOut: Boolean(row.sold_out),
    featured: Boolean(row.featured),
  };
}

function mapProductToRow(p: Product, sortOrder = 0): ProductRow {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    origin: p.origin,
    tasting_note: p.tastingNote,
    description: p.description,
    image_url: p.imageUrl,
    image_focus: p.imageFocus ?? null,
    variants: p.variants,
    sold_out: p.soldOut,
    featured: Boolean(p.featured),
    sort_order: sortOrder,
  };
}

function mapOrderFromRow(row: OrderRow): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    customer: row.customer,
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal) || 0,
    deliveryFee: Number(row.delivery_fee) || 0,
    total: Number(row.total) || 0,
    paymentMethod: row.payment_method,
    stage: row.stage,
  };
}

function mapOrderToRow(o: Order): OrderRow {
  return {
    id: o.id,
    created_at: o.createdAt,
    customer_name: o.customer.name,
    customer_phone: normalizePhone(o.customer.phone),
    customer: { ...o.customer, phone: normalizePhone(o.customer.phone) },
    items: o.items,
    subtotal: o.subtotal,
    delivery_fee: o.deliveryFee,
    total: o.total,
    payment_method: o.paymentMethod,
    stage: o.stage,
  };
}

class NagasDatabase {
  private supabase: SupabaseClient | null = null;
  private mode: BackendMode = 'local-json';
  private initialized = false;

  constructor() {
    const creds = getSupabaseCredentials();
    if (creds) {
      this.supabase = createClient(creds.url, creds.key, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      this.mode = 'supabase';
    }
  }

  getMode(): BackendMode {
    return this.mode;
  }

  private async readLocalFile(): Promise<StoreSnapshot> {
    try {
      const raw = await fs.readFile(LOCAL_STORE_PATH, 'utf8');
      const parsed = JSON.parse(raw) as Partial<StoreSnapshot>;
      const fallback = getDefaultSnapshot();
      return {
        products: Array.isArray(parsed.products) ? parsed.products : fallback.products,
        orders: Array.isArray(parsed.orders) ? parsed.orders : fallback.orders,
        testimonials: Array.isArray(parsed.testimonials)
          ? parsed.testimonials
          : fallback.testimonials,
        inquiries: Array.isArray(parsed.inquiries)
          ? parsed.inquiries
          : fallback.inquiries,
        settings:
          parsed.settings && typeof parsed.settings === 'object'
            ? { ...fallback.settings, ...parsed.settings }
            : fallback.settings,
      };
    } catch {
      const initial = getDefaultSnapshot();
      await this.writeLocalFile(initial);
      return initial;
    }
  }

  private async writeLocalFile(snapshot: StoreSnapshot): Promise<void> {
    const tmp = `${LOCAL_STORE_PATH}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(snapshot, null, 2), 'utf8');
    await fs.rename(tmp, LOCAL_STORE_PATH);
  }

  private async ensureSeeded(): Promise<void> {
    if (this.initialized) return;
    if (!this.supabase) {
      await this.readLocalFile();
      this.initialized = true;
      return;
    }

    try {
      const { count, error } = await this.supabase
        .from('nagas_products')
        .select('id', { count: 'exact', head: true });

      if (error) throw error;

      if ((count ?? 0) === 0) {
        await this.seedSupabase(getDefaultSnapshot());
      }
      this.initialized = true;
    } catch (err) {
      console.warn(
        '[NAGAS Backend] Supabase unavailable or schema not yet applied; falling back to local JSON store:',
        err instanceof Error ? err.message : err
      );
      this.supabase = null;
      this.mode = 'local-json';
      await this.readLocalFile();
      this.initialized = true;
    }
  }

  private async seedSupabase(snapshot: StoreSnapshot): Promise<void> {
    if (!this.supabase) return;
    await this.supabase
      .from('nagas_products')
      .upsert(snapshot.products.map((p, idx) => mapProductToRow(p, idx)));

    if (snapshot.orders.length > 0) {
      await this.supabase
        .from('nagas_orders')
        .upsert(snapshot.orders.map(mapOrderToRow));
    }

    if (snapshot.testimonials.length > 0) {
      await this.supabase.from('nagas_testimonials').upsert(
        snapshot.testimonials.map((t) => ({
          id: t.id,
          author: t.author,
          location: t.location,
          item_bought: t.itemBought,
          quote: t.quote,
          created_at: t.createdAt,
        }))
      );
    }

    if (snapshot.inquiries.length > 0) {
      await this.supabase.from('nagas_inquiries').upsert(
        snapshot.inquiries.map((i) => ({
          id: i.id,
          name: i.name,
          phone: i.phone,
          email: i.email,
          message: i.message,
          created_at: i.createdAt,
          read: i.read,
        }))
      );
    }

    await this.supabase.from('nagas_settings').upsert({
      id: 'default',
      whatsapp_number: snapshot.settings.whatsappNumber,
      delivery_fee: snapshot.settings.deliveryFee,
      free_delivery_threshold: snapshot.settings.freeDeliveryThreshold,
      announcement_text: snapshot.settings.announcementText,
      hero_media: snapshot.settings.heroMedia,
    });
  }

  async getSnapshot(): Promise<StoreSnapshot> {
    await this.ensureSeeded();
    if (!this.supabase) {
      return this.readLocalFile();
    }

    const [prodRes, ordRes, tmRes, inqRes, setRes] = await Promise.all([
      this.supabase
        .from('nagas_products')
        .select('*')
        .order('sort_order', { ascending: true }),
      this.supabase
        .from('nagas_orders')
        .select('*')
        .order('created_at', { ascending: false }),
      this.supabase
        .from('nagas_testimonials')
        .select('*')
        .order('created_at', { ascending: false }),
      this.supabase
        .from('nagas_inquiries')
        .select('*')
        .order('created_at', { ascending: false }),
      this.supabase
        .from('nagas_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle(),
    ]);

    const fallback = getDefaultSnapshot();
    const products = prodRes.data?.length
      ? (prodRes.data as ProductRow[]).map(mapProductFromRow)
      : fallback.products;
    const orders = ordRes.data
      ? (ordRes.data as OrderRow[]).map(mapOrderFromRow)
      : fallback.orders;
    const testimonials: Testimonial[] = tmRes.data
      ? (tmRes.data as TestimonialRow[]).map((t) => ({
          id: t.id,
          author: t.author,
          location: t.location,
          itemBought: t.item_bought,
          quote: t.quote,
          createdAt: t.created_at,
        }))
      : fallback.testimonials;
    const inquiries: Inquiry[] = inqRes.data
      ? (inqRes.data as InquiryRow[]).map((i) => ({
          id: i.id,
          name: i.name,
          phone: i.phone,
          email: i.email,
          message: i.message,
          createdAt: i.created_at,
          read: Boolean(i.read),
        }))
      : fallback.inquiries;

    const sRow = setRes.data as SettingsRow | null;
    const settings: SiteSettings = sRow
      ? {
          whatsappNumber: sRow.whatsapp_number,
          deliveryFee: Number(sRow.delivery_fee),
          freeDeliveryThreshold: Number(sRow.free_delivery_threshold),
          announcementText: sRow.announcement_text,
          heroMedia: sRow.hero_media || fallback.settings.heroMedia,
        }
      : fallback.settings;

    return { products, orders, testimonials, inquiries, settings };
  }

  async getOrdersByPhone(phone: string): Promise<Order[]> {
    const clean = normalizePhone(phone);
    if (!clean) return [];
    const snapshot = await this.getSnapshot();
    return snapshot.orders.filter(
      (o) => normalizePhone(o.customer.phone) === clean
    );
  }

  async createOrder(payload: {
    customer: ShippingDetails;
    items: CartItem[];
    paymentMethod: PaymentMethod;
  }): Promise<Order> {
    const snapshot = await this.getSnapshot();

    // Verify prices against current server-side product catalogue
    const verifiedItems: CartItem[] = payload.items.map((item) => {
      const prod = snapshot.products.find((p) => p.id === item.productId);
      const variant = prod?.variants.find((v) => v.format === item.format);
      return {
        productId: item.productId,
        productName: prod?.name ?? item.productName,
        format: variant?.format ?? item.format,
        unitPrice: variant?.price ?? item.unitPrice,
        quantity: Math.max(1, Math.round(Number(item.quantity) || 1)),
        imageUrl: prod?.imageUrl ?? item.imageUrl,
      };
    });

    const subtotal = calculateSubtotal(verifiedItems);
    const deliveryFee = calculateDeliveryFee(
      subtotal,
      snapshot.settings.deliveryFee,
      snapshot.settings.freeDeliveryThreshold
    );
    const total = subtotal + deliveryFee;

    const order: Order = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      customer: {
        ...payload.customer,
        phone: normalizePhone(payload.customer.phone),
      },
      items: verifiedItems,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: payload.paymentMethod,
      stage: 'Placed',
    };

    if (!this.supabase) {
      snapshot.orders = [order, ...snapshot.orders];
      await this.writeLocalFile(snapshot);
      return order;
    }

    const { error } = await this.supabase
      .from('nagas_orders')
      .insert(mapOrderToRow(order));
    if (error) throw error;
    return order;
  }

  async updateOrderStage(orderId: string, stage: OrderStage): Promise<Order[]> {
    if (!ORDER_STAGES.includes(stage)) {
      throw new Error('Invalid order stage');
    }
    const snapshot = await this.getSnapshot();
    if (!this.supabase) {
      snapshot.orders = snapshot.orders.map((o) =>
        o.id === orderId ? { ...o, stage } : o
      );
      await this.writeLocalFile(snapshot);
      return snapshot.orders;
    }

    const { error } = await this.supabase
      .from('nagas_orders')
      .update({ stage })
      .eq('id', orderId);
    if (error) throw error;
    return (await this.getSnapshot()).orders;
  }

  async upsertProduct(product: Product): Promise<Product[]> {
    const snapshot = await this.getSnapshot();
    if (!this.supabase) {
      const exists = snapshot.products.some((p) => p.id === product.id);
      snapshot.products = exists
        ? snapshot.products.map((p) => (p.id === product.id ? product : p))
        : [product, ...snapshot.products];
      await this.writeLocalFile(snapshot);
      return snapshot.products;
    }

    const existingIdx = snapshot.products.findIndex((p) => p.id === product.id);
    const sortOrder = existingIdx >= 0 ? existingIdx : -1;
    const { error } = await this.supabase
      .from('nagas_products')
      .upsert(mapProductToRow(product, sortOrder));
    if (error) throw error;
    return (await this.getSnapshot()).products;
  }

  async deleteProduct(productId: string): Promise<Product[]> {
    const snapshot = await this.getSnapshot();
    if (!this.supabase) {
      snapshot.products = snapshot.products.filter((p) => p.id !== productId);
      await this.writeLocalFile(snapshot);
      return snapshot.products;
    }

    const { error } = await this.supabase
      .from('nagas_products')
      .delete()
      .eq('id', productId);
    if (error) throw error;
    return (await this.getSnapshot()).products;
  }

  async toggleProductSoldOut(productId: string): Promise<Product[]> {
    const snapshot = await this.getSnapshot();
    const target = snapshot.products.find((p) => p.id === productId);
    if (!target) return snapshot.products;

    if (!this.supabase) {
      snapshot.products = snapshot.products.map((p) =>
        p.id === productId ? { ...p, soldOut: !p.soldOut } : p
      );
      await this.writeLocalFile(snapshot);
      return snapshot.products;
    }

    const { error } = await this.supabase
      .from('nagas_products')
      .update({ sold_out: !target.soldOut })
      .eq('id', productId);
    if (error) throw error;
    return (await this.getSnapshot()).products;
  }

  async addTestimonial(
    t: Omit<Testimonial, 'id' | 'createdAt'>
  ): Promise<Testimonial[]> {
    const next: Testimonial = {
      ...t,
      id: `tm-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const snapshot = await this.getSnapshot();
    if (!this.supabase) {
      snapshot.testimonials = [next, ...snapshot.testimonials];
      await this.writeLocalFile(snapshot);
      return snapshot.testimonials;
    }

    const { error } = await this.supabase.from('nagas_testimonials').insert({
      id: next.id,
      author: next.author,
      location: next.location,
      item_bought: next.itemBought,
      quote: next.quote,
      created_at: next.createdAt,
    });
    if (error) throw error;
    return (await this.getSnapshot()).testimonials;
  }

  async deleteTestimonial(id: string): Promise<Testimonial[]> {
    const snapshot = await this.getSnapshot();
    if (!this.supabase) {
      snapshot.testimonials = snapshot.testimonials.filter((t) => t.id !== id);
      await this.writeLocalFile(snapshot);
      return snapshot.testimonials;
    }

    const { error } = await this.supabase
      .from('nagas_testimonials')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return (await this.getSnapshot()).testimonials;
  }

  async createInquiry(
    inq: Omit<Inquiry, 'id' | 'createdAt' | 'read'>
  ): Promise<Inquiry> {
    const next: Inquiry = {
      ...inq,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const snapshot = await this.getSnapshot();
    if (!this.supabase) {
      snapshot.inquiries = [next, ...snapshot.inquiries];
      await this.writeLocalFile(snapshot);
      return next;
    }

    const { error } = await this.supabase.from('nagas_inquiries').insert({
      id: next.id,
      name: next.name,
      phone: next.phone,
      email: next.email,
      message: next.message,
      created_at: next.createdAt,
      read: false,
    });
    if (error) throw error;
    return next;
  }

  async toggleInquiryRead(id: string): Promise<Inquiry[]> {
    const snapshot = await this.getSnapshot();
    const target = snapshot.inquiries.find((i) => i.id === id);
    if (!target) return snapshot.inquiries;

    if (!this.supabase) {
      snapshot.inquiries = snapshot.inquiries.map((i) =>
        i.id === id ? { ...i, read: !i.read } : i
      );
      await this.writeLocalFile(snapshot);
      return snapshot.inquiries;
    }

    const { error } = await this.supabase
      .from('nagas_inquiries')
      .update({ read: !target.read })
      .eq('id', id);
    if (error) throw error;
    return (await this.getSnapshot()).inquiries;
  }

  async updateSettings(partial: Partial<SiteSettings>): Promise<SiteSettings> {
    const snapshot = await this.getSnapshot();
    const updated: SiteSettings = {
      ...snapshot.settings,
      ...partial,
      heroMedia: partial.heroMedia
        ? { ...snapshot.settings.heroMedia, ...partial.heroMedia }
        : snapshot.settings.heroMedia,
    };

    if (!this.supabase) {
      snapshot.settings = updated;
      await this.writeLocalFile(snapshot);
      return updated;
    }

    const { error } = await this.supabase.from('nagas_settings').upsert({
      id: 'default',
      whatsapp_number: updated.whatsappNumber,
      delivery_fee: updated.deliveryFee,
      free_delivery_threshold: updated.freeDeliveryThreshold,
      announcement_text: updated.announcementText,
      hero_media: updated.heroMedia,
    });
    if (error) throw error;
    return updated;
  }

  async replaceAll(next: StoreSnapshot): Promise<StoreSnapshot> {
    if (!this.supabase) {
      await this.writeLocalFile(next);
      return next;
    }

    await Promise.all([
      this.supabase.from('nagas_products').delete().neq('id', ''),
      this.supabase.from('nagas_orders').delete().neq('id', ''),
      this.supabase.from('nagas_testimonials').delete().neq('id', ''),
      this.supabase.from('nagas_inquiries').delete().neq('id', ''),
    ]);
    await this.seedSupabase(next);
    return this.getSnapshot();
  }

  async resetAll(): Promise<StoreSnapshot> {
    return this.replaceAll(getDefaultSnapshot());
  }
}

export const db = new NagasDatabase();
