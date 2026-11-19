import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSubtotal,
  calculateDeliveryFee,
  calculateFreeDeliveryProgress,
  validateCheckoutStep1,
  validatePaymentInput,
  validateInquiryForm,
  getNextOrderStage,
  getWeeklyShopHours,
  filterProducts,
  normalizePhone,
} from './commerce';
import type { CartItem, Product } from '../types/commerce';

test('calculateSubtotal computes accurate line-item sum', () => {
  const items: CartItem[] = [
    {
      productId: 'p1',
      productName: 'Mazafati Dates',
      format: '200g Box',
      unitPrice: 280,
      quantity: 2,
      imageUrl: '/img.jpg',
    },
    {
      productId: 'p2',
      productName: 'Wild Forest Honey',
      format: '250g Jar',
      unitPrice: 390,
      quantity: 1,
      imageUrl: '/honey.jpg',
    },
  ];
  assert.equal(calculateSubtotal(items), 950);
});

test('calculateDeliveryFee applies ₹49 below ₹999 and free at/above ₹999', () => {
  assert.equal(calculateDeliveryFee(0, 49, 999), 0);
  assert.equal(calculateDeliveryFee(998, 49, 999), 49);
  assert.equal(calculateDeliveryFee(999, 49, 999), 0);
  assert.equal(calculateDeliveryFee(1450, 49, 999), 0);
});

test('calculateFreeDeliveryProgress tracks remaining amount and percentage', () => {
  const half = calculateFreeDeliveryProgress(500, 999);
  assert.equal(half.isFree, false);
  assert.equal(half.amountRemaining, 499);
  assert.equal(half.percentage, 50);

  const unlocked = calculateFreeDeliveryProgress(1050, 999);
  assert.equal(unlocked.isFree, true);
  assert.equal(unlocked.amountRemaining, 0);
  assert.equal(unlocked.percentage, 100);
});

test('validateCheckoutStep1 rejects invalid fields and accepts valid Indian shipping details', () => {
  const emptyErrs = validateCheckoutStep1({
    name: '',
    phone: '123',
    address: 'short',
    city: '',
    pincode: '6200',
  });
  assert.ok(emptyErrs.name);
  assert.ok(emptyErrs.phone);
  assert.ok(emptyErrs.address);
  assert.ok(emptyErrs.city);
  assert.ok(emptyErrs.pincode);

  const validErrs = validateCheckoutStep1({
    name: 'Karthik Subramanian',
    phone: '+91 98765 43210',
    address: '14 Bharathi Nagar, Edamalaiapatti Pudur',
    city: 'Trichy',
    pincode: '620012',
  });
  assert.deepEqual(validErrs, {});
});

test('validatePaymentInput enforces UPI, Card, Netbanking, and allows Cash on Delivery', () => {
  assert.ok(validatePaymentInput('UPI', { upiId: 'bad-upi' }).upiId);
  assert.deepEqual(validatePaymentInput('UPI', { upiId: 'nagas@okicici' }), {});
  assert.ok(validatePaymentInput('Card', { cardNumber: '123', cardExpiry: '99/99', cardCvv: '1' }).cardNumber);
  assert.deepEqual(validatePaymentInput('Cash on Delivery', {}), {});
});

test('validateInquiryForm checks required fields', () => {
  const errs = validateInquiryForm({ name: 'A', phone: '123', email: 'bad', message: 'hi' });
  assert.ok(errs.name);
  assert.ok(errs.phone);
  assert.ok(errs.email);
  assert.ok(errs.message);
});

test('getNextOrderStage progresses through all 5 stages', () => {
  assert.equal(getNextOrderStage('Placed'), 'Confirmed');
  assert.equal(getNextOrderStage('Confirmed'), 'Packed');
  assert.equal(getNextOrderStage('Packed'), 'Shipped');
  assert.equal(getNextOrderStage('Shipped'), 'Delivered');
  assert.equal(getNextOrderStage('Delivered'), null);
});

test('getWeeklyShopHours highlights Sunday hours accurately', () => {
  // 2026-11-15 is a Sunday
  const sunday = new Date('2026-11-15T11:00:00');
  const hours = getWeeklyShopHours(sunday);
  const today = hours.find((h) => h.isToday);
  assert.equal(today?.day, 'Sunday');
  assert.equal(today?.hours, '10:00 – 14:00');
});

test('normalizePhone strips +91 and spaces', () => {
  assert.equal(normalizePhone('+91 63791 78126'), '6379178126');
  assert.equal(normalizePhone('06379178126'), '6379178126');
});

test('filterProducts matches query and category', () => {
  const sample: Product[] = [
    {
      id: '1',
      name: 'Madinah Ajwa Dates',
      category: 'dates',
      origin: 'Madinah',
      tastingNote: 'Caramel plum',
      description: 'Soft dark dates',
      imageUrl: '/d.jpg',
      variants: [{ format: '100g Pouch', price: 220 }],
      soldOut: false,
    },
    {
      id: '2',
      name: 'Wild Forest Honey',
      category: 'honey',
      origin: 'Western Ghats',
      tastingNote: 'Floral amber',
      description: 'Unheated raw honey',
      imageUrl: '/h.jpg',
      variants: [{ format: '250g Jar', price: 390 }],
      soldOut: false,
    },
  ];
  assert.equal(filterProducts(sample, 'ajwa', 'all').length, 1);
  assert.equal(filterProducts(sample, '', 'honey').length, 1);
  assert.equal(filterProducts(sample, 'ajwa', 'honey').length, 0);
});

import { SEED_PRODUCTS } from '../data/seedData';

test('SEED_PRODUCTS matches the 25-item NAGAS FOODS Trichy catalogue breakdown', () => {
  assert.equal(SEED_PRODUCTS.length, 25);
  assert.equal(SEED_PRODUCTS.filter((p) => p.category === 'dates').length, 11);
  assert.equal(SEED_PRODUCTS.filter((p) => p.category === 'honey').length, 4);
  assert.equal(SEED_PRODUCTS.filter((p) => p.category === 'dry-fruits').length, 10);
  for (const item of SEED_PRODUCTS) {
    assert.ok(item.variants.length > 0, `${item.id} must have at least one variant`);
    assert.ok(item.variants[0].price > 0, `${item.id} price must be positive`);
  }
});

