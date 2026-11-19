import type {
  Inquiry,
  Order,
  Product,
  SiteSettings,
  Testimonial,
} from '../types/commerce';

// Real uploaded brand assets from public/assets/aistudio/
export const HERO_PALM_VIDEO = '/assets/aistudio/hero-palm_a682d7f0.mp4';
export const HERO_PALM_IMAGE = '/assets/aistudio/hero-poster_abcc4401.jpg';

export const IMG_DATES_PALM = '/assets/aistudio/dates-on-palm_4cc29711.jpg';
export const IMG_DATES_PILE = '/assets/aistudio/dates-pile_6e1fdb9a.jpg';
export const IMG_DATES_FLATLAY = '/assets/aistudio/dates-flatlay_8a108750.jpg';
export const IMG_HONEY_JAR = '/assets/aistudio/honey-jar_cb329115.jpg';
export const IMG_DATE_1 = '/assets/aistudio/date-1_c61a02b8.png';
export const IMG_DATE_2 = '/assets/aistudio/date-2_eac2b449.png';
export const IMG_DATE_3 = '/assets/aistudio/date-3_47863ba2.png';

// Studio assets generated for dry fruits, nuts & honey pouring shots
export const IMG_DATES = IMG_DATES_FLATLAY;
export const IMG_HONEY = IMG_HONEY_JAR;
export const IMG_HONEY_STUDIO = '/src/assets/images/product_raw_honey_1794832979109.jpg';
export const IMG_NUTS = '/src/assets/images/product_roasted_nuts_1794832978712.jpg';
export const IMG_FRUITS = '/src/assets/images/product_dried_fruits_1794832979676.jpg';

export const SEED_PRODUCTS: Product[] = [
  // ── 11 DATES & MORE PRODUCTS ────────────────────────────────────────────
  {
    id: 'kimia-dates-400',
    name: 'Kimia Dates 400g Container',
    category: 'dates',
    origin: 'Bam, Iran',
    tastingNote: 'Glossy dark caramel · sealed rigid container',
    description:
      'Original Iranian Kimia dates packed into an airtight 400g container in Trichy—soft, naturally moist, and free of added glucose glaze.',
    imageUrl: IMG_DATES_FLATLAY,
    imageFocus: '50% 45%',
    variants: [{ format: 'Container (400g)', price: 349 }],
    soldOut: false,
    featured: true,
  },
  {
    id: 'kimia-dates-500',
    name: 'Kimia Dates 500g Paper Pack',
    category: 'dates',
    origin: 'Bam, Iran',
    tastingNote: 'Soft toffee flesh · everyday 500g family pack',
    description:
      'Our generous 500g paper pack of plump Iranian Kimia dates sorted by hand for uniform softness and deep natural sweetness.',
    imageUrl: IMG_DATES_PILE,
    imageFocus: '50% 50%',
    variants: [{ format: 'Paper Pack (500g)', price: 399 }],
    soldOut: false,
  },
  {
    id: 'kimia-barari-250',
    name: 'Kimia Barari 250g Box',
    category: 'dates',
    origin: 'Bam, Iran',
    tastingNote: 'Rich Barari selection · neat 250g gift box',
    description:
      'Selected Barari harvest dates packed in a rigid 250g Trichy box—silky skin, tender bite, and zero artificial gloss.',
    imageUrl: IMG_DATES_FLATLAY,
    imageFocus: '30% 60%',
    variants: [{ format: 'Box (250g)', price: 249 }],
    soldOut: false,
  },
  {
    id: 'seedless-dates-box',
    name: 'Seedless Dates Box',
    category: 'dates',
    origin: 'Khuzestan, Iran',
    tastingNote: 'Cleanly pitted caramel · ready for snacking & smoothies',
    description:
      'Hand-pitted seedless dates packed cleanly in rigid boxes for breakfast bowls, milkshakes, halwa, and effortless daily snacking.',
    imageUrl: IMG_DATES_FLATLAY,
    imageFocus: '65% 55%',
    variants: [
      { format: 'Box (300g)', price: 279 },
      { format: 'Box (500g)', price: 429 },
    ],
    soldOut: false,
    featured: true,
  },
  {
    id: 'seedless-dates-250-box',
    name: 'Seedless Dates 250g Box',
    category: 'dates',
    origin: 'Khuzestan, Iran',
    tastingNote: 'No-pit convenience · tender mahogany flesh',
    description:
      'Compact 250g pitted dates box ideal for school tiffins, desk drawers, and quick natural pre-workout energy.',
    imageUrl: IMG_DATES_PILE,
    imageFocus: '40% 45%',
    variants: [{ format: 'Box (250g)', price: 229 }],
    soldOut: false,
  },
  {
    id: 'seed-dates-500-packet',
    name: 'Seed Dates 500g Packet',
    category: 'dates',
    origin: 'Southern Iran',
    tastingNote: 'Traditional whole-seed dates · balanced sweetness',
    description:
      'Classic whole-seed dates weighed and sealed into a sturdy 500g pantry packet—firm texture and honest orchard flavour.',
    imageUrl: IMG_DATES_PALM,
    imageFocus: '50% 50%',
    variants: [{ format: 'Packet (500g)', price: 299 }],
    soldOut: false,
  },
  {
    id: 'seedless-dates-500-packet',
    name: 'Seedless Dates 500g Packet',
    category: 'dates',
    origin: 'Khuzestan, Iran',
    tastingNote: 'Pitted kitchen staple · 500g value pouch',
    description:
      'Full half-kilo of cleanly pitted seedless dates sealed fresh for kitchens that bake, blend, and snack daily.',
    imageUrl: IMG_DATES_FLATLAY,
    imageFocus: '75% 40%',
    variants: [{ format: 'Packet (500g)', price: 449 }],
    soldOut: false,
  },
  {
    id: 'mixed-nuts-250-box',
    name: 'Mixed Nuts 250g Box',
    category: 'dates',
    origin: 'Sorted in Trichy',
    tastingNote: 'Almonds, cashews, pistachios & raisins',
    description:
      'A balanced Trichy pantry assortment of whole badham, ivory cashews, pistachios, and golden raisins packed into a rigid 250g box.',
    imageUrl: IMG_NUTS,
    imageFocus: '50% 50%',
    variants: [{ format: 'Box (250g)', price: 449 }],
    soldOut: false,
    featured: true,
  },
  {
    id: 'mixed-seed-250-box',
    name: 'Mixed Seed 250g Box',
    category: 'dates',
    origin: 'Sorted in Trichy',
    tastingNote: 'Pumpkin, sunflower, chia & flax blend',
    description:
      'Crisp daily seed medley cleaned and sealed without oil or salt—ready to spoon over salads, porridge, or curd.',
    imageUrl: IMG_NUTS,
    imageFocus: '35% 70%',
    variants: [{ format: 'Box (250g)', price: 349 }],
    soldOut: false,
  },
  {
    id: 'black-dates-250-pouch',
    name: 'Black Dates 250g Pouch',
    category: 'dates',
    origin: 'Al-Madinah / Bam',
    tastingNote: 'Deep ebony skin · mineral-rich caramel',
    description:
      'Dark, glossy black dates sealed in a stand-up 250g kraft pouch for fresh storage in your kitchen cupboard.',
    imageUrl: IMG_DATES_PILE,
    imageFocus: '25% 55%',
    variants: [{ format: 'Pouch (250g)', price: 199 }],
    soldOut: false,
  },
  {
    id: 'seed-dates-250-pouch',
    name: 'Seed Dates 250g Pouch',
    category: 'dates',
    origin: 'Southern Iran',
    tastingNote: 'Semi-dry whole dates · light honey chew',
    description:
      'Everyday 250g pouch of whole-seed dates offering clean caramel flavour at an accessible household price.',
    imageUrl: IMG_DATES_PALM,
    imageFocus: '60% 60%',
    variants: [{ format: 'Pouch (250g)', price: 169 }],
    soldOut: false,
  },

  // ── 4 HONEY COLLECTIONS ─────────────────────────────────────────────────
  {
    id: 'honey-badham',
    name: 'Honey with Badham',
    category: 'honey',
    origin: 'Western Ghats & California',
    tastingNote: 'Whole roasted badham steeped in raw forest honey',
    description:
      'Unheated wild forest honey poured over crisp whole almonds in a clear glass jar—every spoonful balances floral nectar with nutty crunch.',
    imageUrl: IMG_HONEY_JAR,
    imageFocus: '50% 50%',
    variants: [{ format: 'Jar', price: 449 }],
    soldOut: false,
    featured: true,
  },
  {
    id: 'honey-cashew',
    name: 'Honey with Cashew',
    category: 'honey',
    origin: 'Western Ghats & Panruti',
    tastingNote: 'Creamy W240 cashews bathed in amber honey',
    description:
      'Whole ivory cashews cured in cold-strained wild honey so the honey softens the nut’s richness with gentle wildflower warmth.',
    imageUrl: IMG_HONEY_STUDIO,
    imageFocus: '50% 50%',
    variants: [{ format: 'Jar', price: 499 }],
    soldOut: false,
    featured: true,
  },
  {
    id: 'honey-athi',
    name: 'Honey with Athi (Fig)',
    category: 'honey',
    origin: 'Western Ghats & Afghanistan',
    tastingNote: 'Tender dried figs infused in pure glass-jar honey',
    description:
      'Sun-dried Afghani figs steeped slowly in raw forest honey—an iron-rich morning spoonful with natural seed crunch.',
    imageUrl: IMG_HONEY_JAR,
    imageFocus: '45% 60%',
    variants: [{ format: 'Jar', price: 479 }],
    soldOut: false,
  },
  {
    id: 'honey-mixed-nuts',
    name: 'Honey with Mixed Nuts',
    category: 'honey',
    origin: 'Packed in Trichy',
    tastingNote: 'Almonds, cashews, walnuts & figs in raw honey',
    description:
      'Our signature mixed-nut jar drenched in unheated forest honey. One spoon every morning or gifted in festive hampers.',
    imageUrl: IMG_HONEY_STUDIO,
    imageFocus: '40% 45%',
    variants: [{ format: 'Jar', price: 549 }],
    soldOut: false,
  },

  // ── 10 POUCH & BOX RANGE ────────────────────────────────────────────────
  {
    id: 'badham',
    name: 'Badham',
    category: 'dry-fruits',
    origin: 'Sorted in Trichy',
    tastingNote: 'Crisp sweet almond kernels · unbroken whole nuts',
    description:
      'Thin-skinned Nonpareil badham sorted tray by tray in Edamalaiapatti Pudur—sweet cream snap ideal for soaking or snacking.',
    imageUrl: IMG_NUTS,
    imageFocus: '45% 65%',
    variants: [
      { format: '100g Pouch', price: 149 },
      { format: '100g Box', price: 169 },
      { format: '200g Box', price: 299 },
    ],
    soldOut: false,
    featured: true,
  },
  {
    id: 'cashew',
    name: 'Cashew',
    category: 'dry-fruits',
    origin: 'Panruti & Konkan',
    tastingNote: 'Jumbo ivory whole cashews · buttery sweetness',
    description:
      'Whole ivory W240 cashews checked for zero splits and bright creamy crunch—equally suited for payasam, korma, or raw snacking.',
    imageUrl: IMG_NUTS,
    imageFocus: '65% 65%',
    variants: [
      { format: '100g Pouch', price: 159 },
      { format: '100g Box', price: 179 },
      { format: '200g Box', price: 319 },
    ],
    soldOut: false,
    featured: true,
  },
  {
    id: 'fig',
    name: 'Fig',
    category: 'dry-fruits',
    origin: 'Afghanistan',
    tastingNote: 'Sun-dried athi rounds · gentle seed pop',
    description:
      'Tender, fibre-dense Afghani dried figs strung and hand-sorted so only soft, uncrushed pieces enter our pouches and boxes.',
    imageUrl: IMG_FRUITS,
    imageFocus: '30% 35%',
    variants: [
      { format: '100g Pouch', price: 139 },
      { format: '100g Box', price: 159 },
      { format: '200g Box', price: 279 },
    ],
    soldOut: false,
  },
  {
    id: 'salted-pista',
    name: 'Salted Pista',
    category: 'dry-fruits',
    origin: 'Rafsanjan, Iran',
    tastingNote: 'Naturally open shell · crisp sea-salt roast',
    description:
      'Vibrant emerald-kernel Iranian pistachios roasted lightly with mineral salt for an addictive afternoon crunch.',
    imageUrl: IMG_NUTS,
    imageFocus: '75% 70%',
    variants: [
      { format: '100g Pouch', price: 169 },
      { format: '100g Box', price: 189 },
      { format: '200g Box', price: 339 },
    ],
    soldOut: false,
  },
  {
    id: 'dry-amla',
    name: 'Dry Amla',
    category: 'dry-fruits',
    origin: 'Tamil Nadu Orchards',
    tastingNote: 'Tangy sweet gooseberry · vitamin-C classic',
    description:
      'Sun-cured Indian gooseberry wedges offering bright tangy-sweet refreshment after meals or during travel.',
    imageUrl: IMG_FRUITS,
    imageFocus: '55% 60%',
    variants: [
      { format: '100g Pouch', price: 89 },
      { format: '100g Box', price: 109 },
      { format: '200g Box', price: 189 },
    ],
    soldOut: false,
  },
  {
    id: 'dry-kiwi',
    name: 'Dry Kiwi',
    category: 'dry-fruits',
    origin: 'Orchard Dried',
    tastingNote: 'Bright emerald tangy-sweet slices',
    description:
      'Chewy, vibrant dried kiwi slices packed cleanly in moisture-lock pouches and gift boxes.',
    imageUrl: IMG_FRUITS,
    imageFocus: '70% 45%',
    variants: [
      { format: '100g Pouch', price: 119 },
      { format: '100g Box', price: 139 },
      { format: '200g Box', price: 249 },
    ],
    soldOut: false,
    featured: true,
  },
  {
    id: 'dry-black-grapes',
    name: 'Dry Black Grapes',
    category: 'dry-fruits',
    origin: 'Sangli & Nashik',
    tastingNote: 'Iron-rich dark raisins · soft seedless berry',
    description:
      'Naturally sun-dried black seedless grapes packed with deep berry sweetness—great soaked overnight or eaten by the handful.',
    imageUrl: IMG_FRUITS,
    imageFocus: '25% 60%',
    variants: [
      { format: '100g Pouch', price: 99 },
      { format: '100g Box', price: 119 },
      { format: '200g Box', price: 209 },
    ],
    soldOut: false,
  },
  {
    id: 'dry-yellow-grapes',
    name: 'Dry Yellow Grapes',
    category: 'dry-fruits',
    origin: 'Kandahar / Sangli',
    tastingNote: 'Plump golden kishmish · honeyed tang',
    description:
      'Long golden raisins with zero artificial gloss—essential for South Indian payasam, biryani, and everyday pantry jars.',
    imageUrl: IMG_FRUITS,
    imageFocus: '65% 75%',
    variants: [
      { format: '100g Pouch', price: 99 },
      { format: '100g Box', price: 119 },
      { format: '200g Box', price: 209 },
    ],
    soldOut: false,
  },
  {
    id: 'walnut',
    name: 'Walnut',
    category: 'dry-fruits',
    origin: 'Anantnag, Kashmir',
    tastingNote: 'High-oil snow-white halves · crisp & mild',
    description:
      'Whole Kashmiri walnut kernels hand-cracked and sealed fresh to prevent bitterness. Also available in our 250g value pouch.',
    imageUrl: IMG_NUTS,
    imageFocus: '25% 65%',
    variants: [
      { format: '100g Pouch', price: 179 },
      { format: '100g Box', price: 199 },
      { format: '250g Pouch', price: 399 },
    ],
    soldOut: false,
  },
  {
    id: 'dry-cherry',
    name: 'Dry Cherry',
    category: 'dry-fruits',
    origin: 'Kashmir Orchards',
    tastingNote: 'Tart-sweet ruby cherries · soft chewy bite',
    description:
      'Sun-cured ruby cherries without synthetic dye—bright orchard flavour for oatmeal, cakes, and snack mixes.',
    imageUrl: IMG_FRUITS,
    imageFocus: '35% 65%',
    variants: [
      { format: '100g Pouch', price: 149 },
      { format: '100g Box', price: 169 },
    ],
    soldOut: false,
  },
];

export const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: 'tm-01',
    author: 'Meenakshi Sundaram',
    location: 'Thillai Nagar, Trichy',
    itemBought: 'Kimia Dates 400g Container & Honey with Badham',
    quote:
      'Every Kimia date in the container was soft, clean, and evenly sized—nothing crushed or dried out. Our family switched to NAGAS six months ago and never looked back.',
    createdAt: '2026-09-18T10:30:00Z',
  },
  {
    id: 'tm-02',
    author: 'Abdul Rahman K.',
    location: 'Edamalaiapatti Pudur, Trichy',
    itemBought: 'Seedless Dates Box · 500g',
    quote:
      'Walking into their store feels honest: you can taste the difference in freshness immediately, and the same-day home delivery across Trichy is remarkably reliable.',
    createdAt: '2026-10-04T16:15:00Z',
  },
  {
    id: 'tm-03',
    author: 'Priyadharshini V.',
    location: 'Srirangam, Trichy',
    itemBought: 'Walnut & Fig 200g Boxes',
    quote:
      'No stale smell in the walnuts and the figs are genuinely tender. Packaging is neat enough for festive gifting without inflated boutique markups.',
    createdAt: '2026-10-27T09:20:00Z',
  },
  {
    id: 'tm-04',
    author: 'Dr. Senthil Nathan',
    location: 'Cantonment, Trichy',
    itemBought: 'Honey with Mixed Nuts Jar',
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
        productId: 'kimia-dates-400',
        productName: 'Kimia Dates 400g Container',
        format: 'Container (400g)',
        unitPrice: 349,
        quantity: 2,
        imageUrl: IMG_DATES_FLATLAY,
      },
      {
        productId: 'honey-badham',
        productName: 'Honey with Badham',
        format: 'Jar',
        unitPrice: 449,
        quantity: 1,
        imageUrl: IMG_HONEY_JAR,
      },
    ],
    subtotal: 1147,
    deliveryFee: 0,
    total: 1147,
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
        productId: 'seedless-dates-box',
        productName: 'Seedless Dates Box',
        format: 'Box (300g)',
        unitPrice: 279,
        quantity: 1,
        imageUrl: IMG_DATES_FLATLAY,
      },
      {
        productId: 'walnut',
        productName: 'Walnut',
        format: '250g Pouch',
        unitPrice: 399,
        quantity: 1,
        imageUrl: IMG_NUTS,
      },
    ],
    subtotal: 678,
    deliveryFee: 49,
    total: 727,
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
    message:
      'Looking for 25 custom gift boxes of Kimia Dates + Badham for a family wedding in December. Please share bulk rates.',
    createdAt: '2026-11-13T10:12:00Z',
    read: false,
  },
  {
    id: 'inq-02',
    name: 'Imran Sheriff',
    phone: '9842455667',
    email: 'imran.s@example.com',
    message: 'Do you deliver fresh Kimia dates to K.K. Nagar on Sundays before noon?',
    createdAt: '2026-11-14T18:45:00Z',
    read: true,
  },
];

export const SEED_SETTINGS: SiteSettings = {
  whatsappNumber: '6379178126',
  deliveryFee: 49,
  freeDeliveryThreshold: 999,
  announcementText:
    'Original Iranian Kimia Dates packed in Trichy · ₹49 delivery, free above ₹999',
  heroMedia: {
    mode: 'video',
    imageUrl: HERO_PALM_IMAGE,
    videoUrl: HERO_PALM_VIDEO,
    isCustomUploaded: false,
  },
};
