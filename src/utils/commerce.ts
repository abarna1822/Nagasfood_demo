import type {
  CartItem,
  OrderStage,
  PaymentMethod,
  Product,
  ProductCategory,
  ShippingDetails,
  ValidationErrors,
} from '../types/commerce';

export const ORDER_STAGES: OrderStage[] = [
  'Placed',
  'Confirmed',
  'Packed',
  'Shipped',
  'Delivered',
];

export function formatINR(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  return `₹${safe.toLocaleString('en-IN')}`;
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function calculateDeliveryFee(
  subtotal: number,
  deliveryFee: number,
  freeDeliveryThreshold: number
): number {
  if (subtotal <= 0) return 0;
  if (subtotal >= freeDeliveryThreshold) return 0;
  return deliveryFee;
}

export function calculateFreeDeliveryProgress(
  subtotal: number,
  freeDeliveryThreshold: number
): {
  isFree: boolean;
  amountRemaining: number;
  percentage: number;
} {
  if (freeDeliveryThreshold <= 0 || subtotal >= freeDeliveryThreshold) {
    return {
      isFree: subtotal > 0,
      amountRemaining: 0,
      percentage: subtotal > 0 ? 100 : 0,
    };
  }
  const amountRemaining = Math.max(0, freeDeliveryThreshold - subtotal);
  const percentage = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  return {
    isFree: false,
    amountRemaining,
    percentage,
  };
}

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

export function validateCheckoutStep1(details: ShippingDetails): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!details.name.trim() || details.name.trim().length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }
  const phoneDigits = normalizePhone(details.phone);
  if (phoneDigits.length !== 10 || !/^[6-9]\d{9}$/.test(phoneDigits)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  }
  if (!details.address.trim() || details.address.trim().length < 8) {
    errors.address = 'Please enter a complete street address and landmark.';
  }
  if (!details.city.trim() || details.city.trim().length < 2) {
    errors.city = 'Please enter your city or town.';
  }
  const pin = details.pincode.trim();
  if (!/^\d{6}$/.test(pin)) {
    errors.pincode = 'Enter a valid 6-digit postal pincode.';
  }
  return errors;
}

export function validatePaymentInput(
  method: PaymentMethod,
  payload: {
    upiId?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
    bankName?: string;
    walletApp?: string;
  }
): ValidationErrors {
  const errors: ValidationErrors = {};
  if (method === 'UPI') {
    const upi = (payload.upiId ?? '').trim();
    if (!upi || !/^[\w.-]+@[\w.-]+$/.test(upi)) {
      errors.upiId = 'Enter a valid UPI ID (e.g., name@okaxis).';
    }
  } else if (method === 'Card') {
    const num = (payload.cardNumber ?? '').replace(/\s+/g, '');
    if (!/^\d{12,19}$/.test(num)) {
      errors.cardNumber = 'Enter a valid 12–19 digit card number.';
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test((payload.cardExpiry ?? '').trim())) {
      errors.cardExpiry = 'Use MM/YY expiry format.';
    }
    if (!/^\d{3,4}$/.test((payload.cardCvv ?? '').trim())) {
      errors.cardCvv = 'Enter a 3 or 4 digit CVV.';
    }
  } else if (method === 'Netbanking') {
    if (!payload.bankName) {
      errors.bankName = 'Select a bank to continue.';
    }
  } else if (method === 'Wallets') {
    if (!payload.walletApp) {
      errors.walletApp = 'Select a digital wallet to continue.';
    }
  }
  return errors;
}

export function validateInquiryForm(form: {
  name: string;
  phone: string;
  email: string;
  message: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!form.name.trim() || form.name.trim().length < 2) {
    errors.name = 'Please enter your name.';
  }
  const phoneDigits = normalizePhone(form.phone);
  if (phoneDigits.length !== 10) {
    errors.phone = 'Enter a 10-digit phone number.';
  }
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!form.message.trim() || form.message.trim().length < 6) {
    errors.message = 'Please tell us what you are looking for (at least 6 characters).';
  }
  return errors;
}

export function filterProducts(
  products: Product[],
  query: string,
  category: ProductCategory | 'all' = 'all'
): Product[] {
  const q = query.trim().toLowerCase();
  return products.filter((p) => {
    const matchesCategory = category === 'all' || p.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.origin.toLowerCase().includes(q) ||
      p.tastingNote.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });
}

export function getNextOrderStage(current: OrderStage): OrderStage | null {
  const idx = ORDER_STAGES.indexOf(current);
  if (idx === -1 || idx >= ORDER_STAGES.length - 1) return null;
  return ORDER_STAGES[idx + 1];
}

export function getOrderStageIndex(stage: OrderStage): number {
  return ORDER_STAGES.indexOf(stage);
}

export interface ShopHourEntry {
  day: string;
  hours: string;
  isToday: boolean;
  dayIndex: number; // 0 = Sun, 1 = Mon ... 6 = Sat
}

export function getWeeklyShopHours(now: Date = new Date()): ShopHourEntry[] {
  const currentDay = now.getDay();
  const schedule: Array<{ day: string; hours: string; dayIndex: number }> = [
    { day: 'Monday', hours: '9:00 – 21:00', dayIndex: 1 },
    { day: 'Tuesday', hours: '9:00 – 21:00', dayIndex: 2 },
    { day: 'Wednesday', hours: '9:00 – 21:00', dayIndex: 3 },
    { day: 'Thursday', hours: '9:00 – 21:00', dayIndex: 4 },
    { day: 'Friday', hours: '9:00 – 21:00', dayIndex: 5 },
    { day: 'Saturday', hours: '9:00 – 21:00', dayIndex: 6 },
    { day: 'Sunday', hours: '10:00 – 14:00', dayIndex: 0 },
  ];
  return schedule.map((entry) => ({
    ...entry,
    isToday: entry.dayIndex === currentDay,
  }));
}

export function generateOrderId(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  const ts = Date.now().toString().slice(-4);
  return `NG-${ts}-${rand}`;
}

export function buildWhatsAppHref(phone: string, text: string): string {
  const clean = phone.replace(/\D/g, '');
  const fullNumber = clean.length === 10 ? `91${clean}` : clean;
  return `https://wa.me/${fullNumber}?text=${encodeURIComponent(text)}`;
}
