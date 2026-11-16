import type {
  Inquiry,
  Order,
  Product,
  SiteSettings,
  Testimonial,
} from '../types/commerce';

export const HERO_PALM_IMAGE = '/src/assets/images/hero_date_palm_oasis_1794832977471.jpg';
export const IMG_DATES = '/src/assets/images/product_royal_dates_1794832977981.jpg';
export const IMG_HONEY = '/src/assets/images/product_raw_honey_1794832979109.jpg';
export const IMG_NUTS = '/src/assets/images/product_roasted_nuts_1794832978712.jpg';
export const IMG_FRUITS = '/src/assets/images/product_dried_fruits_1794832979676.jpg';

export const SEED_PRODUCTS: Product[] = [
  // ── 11 DATES-LED PRODUCTS ───────────────────────────────────────────────
  {
    id: 'dt-01',
    name: 'Iranian Mazafati Dates',
    category: 'dates',
    origin: 'Bam, Iran',
    tastingNote: 'Velvet chocolate-caramel · moist & fleshy',
    description:
      'Harvested in Bam oasis groves and chilled immediately. Soft, dark mahogany skin that melts gently on the palate without added syrup.',
    imageUrl: IMG_DATES,
    imageFocus: '50% 50%',
    variants: [
      { format: '100g Pouch', price: 110 },
      { format: '100g Box', price: 125 },
      { format: '200g Box', price: 230 },
    ],
    soldOut: false,
    featured: true,
  },
  {
    id: 'dt-02',
    name: 'Kimya Soft Dates',
    category: 'dates',
    origin: 'Bam, Iran',
    tastingNote: 'Silky dark toffee · zero refined sugar',
    description:
      'Our everyday Trichy pantry favourite—hand-selected plump Kimya dates sorted for uniform moisture and deep natural sweetness.',
    imageUrl: IMG_DATES,
    imageFocus: '30% 60%',
    variants: [
      { format: '100g Pouch', price: 95 },
      { format: '100g Box', price: 110 },
      { format: '200g Box', price: 195 },
    ],
    soldOut: false,
    featured: true,
  },
  {
    id: 'dt-03',
    name: 'Royal Medjool Dates',
    category: 'dates',
    origin: 'Jordan Valley',
    tastingNote: 'Honeyed fig · large king-grade fruit',
    description:
      'Large, amber-mahogany Medjool dates prized for their generous bite and warm brown-sugar finish. Ideal for gifting or evening chai.',
    imageUrl: IMG_DATES,
    imageFocus: '70% 45%',
    variants: [
      { format: '100g Pouch', price: 190 },
      { format: '100g Box', price: 210 },
      { format: '200g Box', price: 390 },
    ],
    soldOut: false,
    featured: true,
  },
  {
    id: 'dt-04',
    name: 'Madinah Ajwa Dates',
    category: 'dates',
    origin: 'Al-Madinah, KSA',
    tastingNote: 'Prune & roasted cacao · fine wrinkled skin',
    description:
      'Authentic dark Madinah Ajwa dates with delicate ridges and balanced sweetness. Carefully inspected batch by batch in Trichy.',
    imageUrl: IMG_DATES,
    imageFocus: '45% 40%',
    variants: [
      { format: '100g Pouch', price: 240 },
      { format: '100g Box', price: 260 },
      { format: '200g Box', price: 495 },
    ],
    soldOut: false,
    featured: true,
  },
  {
    id: 'dt-05',
    name: 'Kalmi Safawi Dates',
    category: 'dates',
    origin: 'Al-Madinah, KSA',
    tastingNote: 'Rich molasses · firm chewy bite',
    description:
      'Deep ebony Safawi dates with a firm texture and lingering molasses warmth. Rich in potassium and dietary fibre.',
    imageUrl: IMG_DATES,
    imageFocus: '60% 55%',
    variants: [
      { format: '100g Pouch', price: 155 },
      { format: '100g Box', price: 170 },
      { format: '200g Box', price: 320 },
    ],
    soldOut: false,
  },
  {
    id: 'dt-06',
    name: 'Mabroom Chewy Dates',
    category: 'dates',
    origin: 'Saudi Peninsula',
    tastingNote: 'Light butterscotch · slender & semi-dry',
    description:
      'Slender bronze-red Mabroom dates with a gentle chew and low-stickiness finish—ideal for travel snacking or desk tins.',
    imageUrl: IMG_DATES,
    imageFocus: '35% 50%',
    variants: [
      { format: '100g Pouch', price: 165 },
      { format: '100g Box', price: 185 },
      { format: '200g Box', price: 345 },
    ],
    soldOut: false,
  },
  {
    id: 'dt-07',
    name: 'Seedless Dates Box',
    category: 'dates',
    origin: 'Khuzestan, Iran',
    tastingNote: 'Clean pitted caramel · kitchen & smoothie ready',
    description:
      'Hand-pitted seedless dates packed cleanly in rigid boxes for baking, milkshakes, halwa, and effortless daily snacking.',
    imageUrl: IMG_DATES,
    imageFocus: '55% 65%',
    variants: [
      { format: '300g Box', price: 240 },
      { format: '500g Box', price: 380 },
    ],
    soldOut: false,
    featured: true,
  },
  {
    id: 'dt-08',
    name: 'Golden Sukkari Dates',
    category: 'dates',
    origin: 'Al-Qassim',
    tastingNote: 'Crystallised honey · crisp outer shell',
    description:
      'Pale golden Sukkari dates celebrated for their melt-in-the-mouth honeyed core and delicate caramel crunch.',
    imageUrl: IMG_DATES,
    imageFocus: '25% 45%',
    variants: [
      { format: '100g Pouch', price: 175 },
      { format: '100g Box', price: 195 },
      { format: '200g Box', price: 365 },
    ],
    soldOut: false,
  },
  {
    id: 'dt-09',
    name: 'Zahidi Amber Dates',
    category: 'dates',
    origin: 'Southern Iran',
    tastingNote: 'Nutty apricot · semi-dry golden amber',
    description:
      'Firm, nutty, golden-amber Zahidi dates with mild sweetness that pairs beautifully with roasted almonds and filter coffee.',
    imageUrl: IMG_DATES,
    imageFocus: '65% 40%',
    variants: [
      { format: '100g Pouch', price: 105 },
      { format: '100g Box', price: 120 },
      { format: '200g Box', price: 220 },
    ],
    soldOut: false,
  },
  {
    id: 'dt-10',
    name: 'Khudri Harvest Dates',
    category: 'dates',
    origin: 'Al-Kharj',
    tastingNote: 'Warm raisin · tender dark amber',
    description:
      'Classic wrinkled dark-brown Khudri dates with balanced natural sugar and comforting baked-fruit depth.',
    imageUrl: IMG_DATES,
    imageFocus: '40% 60%',
    variants: [
      { format: '100g Pouch', price: 130 },
      { format: '100g Box', price: 145 },
      { format: '200g Box', price: 270 },
    ],
    soldOut: false,
  },
  {
    id: 'dt-11',
    name: 'Dates & Almond Stuffed Bites',
    category: 'dates',
    origin: 'Packed in Trichy',
    tastingNote: 'Soft Mazafati paired with whole roasted almond',
    description:
      'Pitted Iranian dates hand-stuffed in small Trichy batches with crisp California almonds—no chocolate coating, pure whole food.',
    imageUrl: IMG_DATES,
    imageFocus: '50% 42%',
    variants: [
      { format: '100g Pouch', price: 160 },
      { format: '100g Box', price: 180 },
      { format: '200g Box', price: 335 },
    ],
    soldOut: false,
  },

  // ── 4 HONEY (JAR) PRODUCTS ──────────────────────────────────────────────
  {
    id: 'hn-01',
    name: 'Wild Forest Raw Honey',
    category: 'honey',
    origin: 'Western Ghats',
    tastingNote: 'Deep wildflower nectar · unheated & unfiltered',
    description:
      'Collected from forest flora and cold-strained into clear glass jars so natural pollen, enzymes, and amber aroma remain intact.',
    imageUrl: IMG_HONEY,
    imageFocus: '50% 50%',
    variants: [
      { format: '250g Jar', price: 360 },
      { format: '500g Jar', price: 680 },
    ],
    soldOut: false,
    featured: true,
  },
  {
    id: 'hn-02',
    name: 'Kashmir Acacia Honey',
    category: 'honey',
    origin: 'Kashmir Valley',
    tastingNote: 'Pale gold floral · slow to crystallise',
    description:
      'Delicate, translucent spring acacia honey from high-altitude Kashmir orchards. Mild vanilla-blossom finish ideal for warm water and tea.',
    imageUrl: IMG_HONEY,
    imageFocus: '35% 45%',
    variants: [
      { format: '250g Jar', price: 420 },
      { format: '500g Jar', price: 790 },
    ],
    soldOut: false,
    featured: true,
  },
  {
    id: 'hn-03',
    name: 'Nilgiri Jamun Blossom Honey',
    category: 'honey',
    origin: 'Nilgiri Foothills',
    tastingNote: 'Tangy woodland spice · dark amber',
    description:
      'Single-origin Jamun blossom harvest with a distinctive bittersweet woodland note and silky texture.',
    imageUrl: IMG_HONEY,
    imageFocus: '60% 55%',
    variants: [
      { format: '250g Jar', price: 390 },
      { format: '500g Jar', price: 740 },
    ],
    soldOut: false,
  },
  {
    id: 'hn-04',
    name: 'Sidr Mountain Honey',
    category: 'honey',
    origin: 'Highland Groves',
    tastingNote: 'Rich butterscotch & resinous herb',
    description:
      'Prized thick, aromatic Sidr-floral honey harvested once a year. Dense, velvety pour with zero sugar adulteration.',
    imageUrl: IMG_HONEY,
    imageFocus: '45% 60%',
    variants: [
      { format: '250g Jar', price: 540 },
      { format: '500g Jar', price: 1020 },
    ],
    soldOut: false,
  },

  // ── 10 NUTS & DRY FRUITS PRODUCTS ───────────────────────────────────────
  {
    id: 'df-01',
    name: 'Kashmiri Walnut Kernels',
    category: 'dry-fruits',
    origin: 'Anantnag, Kashmir',
    tastingNote: 'Snow-white halves · crisp & mild',
    description:
      'High-oil Kashmiri snow-white walnut halves hand-cracked and vacuum-sealed to prevent bitterness. Available in 250g value pouch.',
    imageUrl: IMG_NUTS,
    imageFocus: '25% 65%',
    variants: [
      { format: '100g Pouch', price: 190 },
      { format: '100g Box', price: 210 },
      { format: '250g Pouch', price: 440 },
    ],
    soldOut: false,
    featured: true,
  },
  {
    id: 'df-02',
    name: 'Ruby Dry Cherry',
    category: 'dry-fruits',
    origin: 'Kashmir Orchards',
    tastingNote: 'Tart-sweet ruby fruit · plump & chewy',
    description:
      'Sun-cured ruby cherries without artificial red dye. Bright tartness that elevates oatmeal, trail mixes, and festive desserts.',
    imageUrl: IMG_FRUITS,
    imageFocus: '35% 65%',
    variants: [
      { format: '100g Pouch', price: 175 },
      { format: '100g Box', price: 195 },
    ],
    soldOut: false,
  },
  {
    id: 'df-03',
    name: 'California Nonpareil Almonds',
    category: 'dry-fruits',
    origin: 'California / Sorted in Trichy',
    tastingNote: 'Sweet cream crunch · uniform whole kernels',
    description:
      'Thin-skinned Nonpareil almonds graded for unbroken size and clean snap. Ideal for soaking overnight or snacking raw.',
    imageUrl: IMG_NUTS,
    imageFocus: '45% 65%',
    variants: [
      { format: '100g Pouch', price: 135 },
      { format: '100g Box', price: 150 },
      { format: '200g Box', price: 280 },
    ],
    soldOut: false,
    featured: true,
  },
  {
    id: 'df-04',
    name: 'Jumbo W240 Cashews',
    category: 'dry-fruits',
    origin: 'Panruti & Konkan',
    tastingNote: 'Ivory whole nuts · buttery sweet finish',
    description:
      'Extra-large W240 whole ivory cashews hand-sorted for zero splits and gentle natural sweetness.',
    imageUrl: IMG_NUTS,
    imageFocus: '65% 65%',
    variants: [
      { format: '100g Pouch', price: 150 },
      { format: '100g Box', price: 165 },
      { format: '200g Box', price: 310 },
    ],
    soldOut: false,
    featured: true,
  },
  {
    id: 'df-05',
    name: 'Roasted Salted Iranian Pistachios',
    category: 'dry-fruits',
    origin: 'Rafsanjan, Iran',
    tastingNote: 'Naturally open shell · sea-salt kiss',
    description:
      'Vibrant emerald-kernel Iranian pistachios slow-roasted in small batches with light mineral salt.',
    imageUrl: IMG_NUTS,
    imageFocus: '75% 70%',
    variants: [
      { format: '100g Pouch', price: 185 },
      { format: '100g Box', price: 205 },
      { format: '200g Box', price: 385 },
    ],
    soldOut: false,
  },
  {
    id: 'df-06',
    name: 'Afghan Golden Raisins',
    category: 'dry-fruits',
    origin: 'Kandahar',
    tastingNote: 'Long sun-cured amber · honeyed tang',
    description:
      'Plump, elongated Kandahari golden raisins with zero sulphite gloss—sweet for payasam, pulao, and kids’ tiffins.',
    imageUrl: IMG_FRUITS,
    imageFocus: '65% 75%',
    variants: [
      { format: '100g Pouch', price: 90 },
      { format: '100g Box', price: 105 },
      { format: '200g Box', price: 190 },
    ],
    soldOut: false,
  },
  {
    id: 'df-07',
    name: 'Black Seedless Raisins',
    category: 'dry-fruits',
    origin: 'Sangli & Nashik',
    tastingNote: 'Iron-rich berry · soft dark skin',
    description:
      'Naturally sun-dried black seedless raisins packed with antioxidants. Soak overnight or enjoy straight from the pouch.',
    imageUrl: IMG_FRUITS,
    imageFocus: '25% 60%',
    variants: [
      { format: '100g Pouch', price: 85 },
      { format: '100g Box', price: 100 },
      { format: '200g Box', price: 180 },
    ],
    soldOut: false,
  },
  {
    id: 'df-08',
    name: 'Afghani Dried Figs (Anjeer)',
    category: 'dry-fruits',
    origin: 'Afghanistan',
    tastingNote: 'Crunchy seed pop · mellow honey flesh',
    description:
      'Thin-skinned sun-dried figs strung and sorted by hand. Tender, fibre-dense rounds with gentle earthy sweetness.',
    imageUrl: IMG_FRUITS,
    imageFocus: '30% 35%',
    variants: [
      { format: '100g Pouch', price: 195 },
      { format: '100g Box', price: 215 },
      { format: '200g Box', price: 405 },
    ],
    soldOut: false,
    featured: true,
  },
  {
    id: 'df-09',
    name: 'Turkish Sun-Dried Apricots',
    category: 'dry-fruits',
    origin: 'Malatya, Turkey',
    tastingNote: 'Velvet apricot jam · unsweetened',
    description:
      'Whole pitted Malatya apricots dried under Anatolian sun. Soft bite with bright orchard acidity.',
    imageUrl: IMG_FRUITS,
    imageFocus: '70% 40%',
    variants: [
      { format: '100g Pouch', price: 145 },
      { format: '100g Box', price: 160 },
      { format: '200g Box', price: 300 },
    ],
    soldOut: false,
  },
  {
    id: 'df-10',
    name: 'Whole Dried Cranberries',
    category: 'dry-fruits',
    origin: 'North America / Sorted in Trichy',
    tastingNote: 'Crisp ruby tartness · soft chewy whole berries',
    description:
      'Whole ruby cranberries gently dried for salads, baking, and balancing rich nuts in daily snack jars.',
    imageUrl: IMG_FRUITS,
    imageFocus: '40% 55%',
    variants: [
      { format: '100g Pouch', price: 140 },
      { format: '100g Box', price: 155 },
      { format: '200g Box', price: 290 },
    ],
    soldOut: false,
  },
];

export const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: 'tm-01',
    author: 'Meenakshi Sundaram',
    location: 'Thillai Nagar, Trichy',
    itemBought: 'Iranian Mazafati Dates & Wild Honey',
    quote:
      'Every Mazafati date in the box was soft, clean, and evenly sized—nothing crushed or dried out. Our family switched to NAGAS six months ago and never looked back.',
    createdAt: '2026-09-18T10:30:00Z',
  },
  {
    id: 'tm-02',
    author: 'Abdul Rahman K.',
    location: 'Edamalaiapatti Pudur, Trichy',
    itemBought: 'Madinah Ajwa Dates · 200g Box',
    quote:
      'Walking into their store feels honest: you can taste the difference in freshness immediately, and the same-day home delivery across Trichy is remarkably reliable.',
    createdAt: '2026-10-04T16:15:00Z',
  },
  {
    id: 'tm-03',
    author: 'Priyadharshini V.',
    location: 'Srirangam, Trichy',
    itemBought: 'Kashmiri Walnut Kernels & Afghani Anjeer',
    quote:
      'No stale smell in the walnuts and the figs are genuinely tender. Packaging is neat enough for festive gifting without inflated boutique markups.',
    createdAt: '2026-10-27T09:20:00Z',
  },
  {
    id: 'tm-04',
    author: 'Dr. Senthil Nathan',
    location: 'Cantonment, Trichy',
    itemBought: 'Kashmir Acacia Honey · 500g Jar',
    quote:
      'Clear glass jar, honest origin, and pure floral aroma. Great to have a transparent local source right here in Trichy.',
    createdAt: '2026-11-05T14:40:00Z',
  },
];

export const SEED_ORDERS: Order[] = [
  {
    id: 'NG-8104-4412',
    createdAt: '2026-11-14T11:20:00Z',
    customer: {
      name: 'Kavitha Balasubramanian',
      phone: '9876543210',
      address: '22 Anna Nagar Main Road, Near Bus Stop',
      city: 'Trichy',
      pincode: '620017',
      deliveryNote: 'Evening delivery preferred after 5 PM',
    },
    items: [
      {
        productId: 'dt-01',
        productName: 'Iranian Mazafati Dates',
        format: '200g Box',
        unitPrice: 230,
        quantity: 2,
        imageUrl: IMG_DATES,
      },
      {
        productId: 'hn-01',
        productName: 'Wild Forest Raw Honey',
        format: '500g Jar',
        unitPrice: 680,
        quantity: 1,
        imageUrl: IMG_HONEY,
      },
    ],
    subtotal: 1140,
    deliveryFee: 0,
    total: 1140,
    paymentMethod: 'UPI',
    stage: 'Shipped',
  },
  {
    id: 'NG-7921-1094',
    createdAt: '2026-11-15T15:05:00Z',
    customer: {
      name: 'Aravindh Raj',
      phone: '6379178126',
      address: '8 Bharathidasan Street, Edamalaiapatti Pudur',
      city: 'Trichy',
      pincode: '620012',
    },
    items: [
      {
        productId: 'dt-04',
        productName: 'Madinah Ajwa Dates',
        format: '100g Box',
        unitPrice: 260,
        quantity: 1,
        imageUrl: IMG_DATES,
      },
      {
        productId: 'df-01',
        productName: 'Kashmiri Walnut Kernels',
        format: '250g Pouch',
        unitPrice: 440,
        quantity: 1,
        imageUrl: IMG_NUTS,
      },
    ],
    subtotal: 700,
    deliveryFee: 49,
    total: 749,
    paymentMethod: 'Cash on Delivery',
    stage: 'Packed',
  },
];

export const SEED_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-01',
    name: 'Lakshmi Narayanan',
    phone: '9443122334',
    email: 'lakshmi.n@example.com',
    message: 'Looking for 25 custom gift boxes of Mazafati Dates + Almonds for a family wedding in December. Please share bulk rates.',
    createdAt: '2026-11-13T10:12:00Z',
    read: false,
  },
  {
    id: 'inq-02',
    name: 'Imran Sheriff',
    phone: '9842455667',
    email: 'imran.s@example.com',
    message: 'Do you deliver fresh Kimya dates to K.K. Nagar on Sundays before noon?',
    createdAt: '2026-11-14T18:45:00Z',
    read: true,
  },
];

export const SEED_SETTINGS: SiteSettings = {
  whatsappNumber: '6379178126',
  deliveryFee: 49,
  freeDeliveryThreshold: 999,
  announcementText:
    'Fresh Bam & Madinah harvest packed in Trichy · ₹49 delivery, free above ₹999',
  heroMedia: {
    mode: 'video',
    imageUrl: HERO_PALM_IMAGE,
    videoUrl: '',
    isCustomUploaded: false,
  },
};
