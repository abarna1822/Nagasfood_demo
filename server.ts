import 'dotenv/config';
import crypto from 'node:crypto';
import path from 'node:path';
import express, { type NextFunction, type Request, type Response } from 'express';
import { db } from './server/db.ts';
import type {
  CartItem,
  OrderStage,
  PaymentMethod,
  Product,
  ShippingDetails,
  SiteSettings,
} from './src/types/commerce.ts';
import {
  validateCheckoutStep1,
  validateInquiryForm,
} from './src/utils/commerce.ts';

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_PASSCODE = (process.env.ADMIN_PASSCODE || 'nagas2026').trim();
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  crypto.createHmac('sha256', 'nagas-trichy-key').update(ADMIN_PASSCODE).digest('hex');

function createAdminToken(): string {
  const issuedAt = Date.now().toString();
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(issuedAt)
    .digest('hex');
  return `${issuedAt}.${sig}`;
}

function verifyAdminToken(token: string | undefined): boolean {
  if (!token || !token.includes('.')) return false;
  const [issuedAt, sig] = token.split('.');
  if (!issuedAt || !sig) return false;
  const expected = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(issuedAt)
    .digest('hex');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : undefined;
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized admin request' });
    return;
  }
  next();
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, backendMode: db.getMode() });
  });

  app.get('/api/bootstrap', async (_req, res) => {
    try {
      const snapshot = await db.getSnapshot();
      res.json({
        products: snapshot.products,
        orders: snapshot.orders,
        testimonials: snapshot.testimonials,
        inquiries: snapshot.inquiries,
        settings: snapshot.settings,
        backendMode: db.getMode(),
      });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to load store data',
      });
    }
  });

  app.get('/api/orders', async (req, res) => {
    try {
      const phone = String(req.query.phone || '');
      if (!phone) {
        const snapshot = await db.getSnapshot();
        res.json({ orders: snapshot.orders });
        return;
      }
      const orders = await db.getOrdersByPhone(phone);
      res.json({ orders });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Order lookup failed',
      });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const { customer, items, paymentMethod } = req.body as {
        customer?: ShippingDetails;
        items?: CartItem[];
        paymentMethod?: PaymentMethod;
      };
      if (!customer || !Array.isArray(items) || items.length === 0 || !paymentMethod) {
        res.status(400).json({ error: 'Missing order items, shipping details, or payment method' });
        return;
      }
      const validation = validateCheckoutStep1(customer);
      if (Object.keys(validation).length > 0) {
        res.status(400).json({ error: 'Invalid shipping details', validation });
        return;
      }

      const order = await db.createOrder({ customer, items, paymentMethod });
      res.status(201).json({ order });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to place order',
      });
    }
  });

  app.post('/api/inquiries', async (req, res) => {
    try {
      const { name = '', phone = '', email = '', message = '' } = req.body as {
        name?: string;
        phone?: string;
        email?: string;
        message?: string;
      };
      const validation = validateInquiryForm({ name, phone, email, message });
      if (Object.keys(validation).length > 0) {
        res.status(400).json({ error: 'Invalid inquiry fields', validation });
        return;
      }
      const inquiry = await db.createInquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      res.status(201).json({ inquiry });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to submit inquiry',
      });
    }
  });

  app.post('/api/admin/login', (req, res) => {
    const passcode = String((req.body as { passcode?: string })?.passcode || '').trim();
    if (passcode !== ADMIN_PASSCODE) {
      res.status(401).json({ error: 'Incorrect passcode. Try nagas2026.' });
      return;
    }
    res.json({ token: createAdminToken(), backendMode: db.getMode() });
  });

  app.post('/api/admin/products', requireAdmin, async (req, res) => {
    try {
      const product = req.body as Product;
      if (!product?.id || !product?.name) {
        res.status(400).json({ error: 'Invalid product payload' });
        return;
      }
      const products = await db.upsertProduct(product);
      res.json({ products });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to save product',
      });
    }
  });

  app.delete('/api/admin/products/:id', requireAdmin, async (req, res) => {
    try {
      const products = await db.deleteProduct(String(req.params.id));
      res.json({ products });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to delete product',
      });
    }
  });

  app.patch('/api/admin/products/:id/sold-out', requireAdmin, async (req, res) => {
    try {
      const products = await db.toggleProductSoldOut(String(req.params.id));
      res.json({ products });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to update stock status',
      });
    }
  });

  app.patch('/api/admin/orders/:id/stage', requireAdmin, async (req, res) => {
    try {
      const stage = (req.body as { stage?: OrderStage })?.stage;
      if (!stage) {
        res.status(400).json({ error: 'Missing order stage' });
        return;
      }
      const orders = await db.updateOrderStage(String(req.params.id), stage);
      res.json({ orders });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to update order stage',
      });
    }
  });

  app.post('/api/admin/testimonials', requireAdmin, async (req, res) => {
    try {
      const { author = '', location = 'Trichy', itemBought = '', quote = '' } = req.body as {
        author?: string;
        location?: string;
        itemBought?: string;
        quote?: string;
      };
      if (!author.trim() || !quote.trim()) {
        res.status(400).json({ error: 'Author and quote are required' });
        return;
      }
      const testimonials = await db.addTestimonial({
        author: author.trim(),
        location: location.trim() || 'Trichy',
        itemBought: itemBought.trim() || 'NAGAS Assortment',
        quote: quote.trim(),
      });
      res.json({ testimonials });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to add testimonial',
      });
    }
  });

  app.delete('/api/admin/testimonials/:id', requireAdmin, async (req, res) => {
    try {
      const testimonials = await db.deleteTestimonial(String(req.params.id));
      res.json({ testimonials });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to delete testimonial',
      });
    }
  });

  app.patch('/api/admin/inquiries/:id/read', requireAdmin, async (req, res) => {
    try {
      const inquiries = await db.toggleInquiryRead(String(req.params.id));
      res.json({ inquiries });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to update inquiry',
      });
    }
  });

  app.patch('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const partial = req.body as Partial<SiteSettings>;
      const settings = await db.updateSettings(partial);
      res.json({ settings });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to save settings',
      });
    }
  });

  app.post('/api/admin/import', requireAdmin, async (req, res) => {
    try {
      const parsed = req.body as {
        products?: Product[];
        orders?: Awaited<ReturnType<typeof db.getSnapshot>>['orders'];
        testimonials?: Awaited<ReturnType<typeof db.getSnapshot>>['testimonials'];
        inquiries?: Awaited<ReturnType<typeof db.getSnapshot>>['inquiries'];
        settings?: SiteSettings;
      };
      const current = await db.getSnapshot();
      const snapshot = await db.replaceAll({
        products: Array.isArray(parsed.products) ? parsed.products : current.products,
        orders: Array.isArray(parsed.orders) ? parsed.orders : current.orders,
        testimonials: Array.isArray(parsed.testimonials)
          ? parsed.testimonials
          : current.testimonials,
        inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : current.inquiries,
        settings: parsed.settings ?? current.settings,
      });
      res.json({ snapshot });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to import JSON',
      });
    }
  });

  app.post('/api/admin/reset', requireAdmin, async (_req, res) => {
    try {
      const snapshot = await db.resetAll();
      res.json({ snapshot });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to reset store data',
      });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `NAGAS FOODS server listening on http://0.0.0.0:${PORT} (backend=${db.getMode()})`
    );
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
