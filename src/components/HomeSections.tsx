import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, MapPin, Plus } from 'lucide-react';
import { IMG_DATES, IMG_FRUITS, IMG_HONEY, IMG_NUTS } from '../data/seedData';
import { useNagasStore } from '../store/StoreContext';
import type { AppView, Product } from '../types/commerce';
import { formatINR, getWeeklyShopHours } from '../utils/commerce';
import { ContactSection } from './ContactSection';
import { ProductMedia } from './ProductMedia';

gsap.registerPlugin(ScrollTrigger);

interface HomeSectionsProps {
  onNavigate: (view: AppView) => void;
  onQuickView: (product: Product) => void;
}

const CHAPTERS = [
  {
    num: '01',
    bg: '#6E0B16',
    title: 'Orchard Selection',
    subtitle: 'Direct partnerships from Bam groves to Kashmir valleys',
    body: 'We buy harvest lots directly at origin—never mixed warehouse remnants. Every date lot is tasted for natural skin tenderness and moisture before shipping.',
  },
  {
    num: '02',
    bg: '#7A0E18',
    title: 'Cold-Chain Transit',
    subtitle: 'Protected moisture without glucose glaze',
    body: 'Soft Mazafati and Kimya dates travel temperature-controlled straight to Tamil Nadu so their caramel flesh arrives plump, never dry or sugar-coated.',
  },
  {
    num: '03',
    bg: '#5E0A13',
    title: 'Hand Sorting in Trichy',
    subtitle: 'Inspected tray by tray in Edamalaiapatti Pudur',
    body: 'Split walnuts, blemished figs, and crushed fruit never enter a pouch. Our Trichy team sorts every kilo by hand before weighing.',
  },
  {
    num: '04',
    bg: '#741020',
    title: 'Sealed Fresh to Order',
    subtitle: '100g pouches, rigid gift boxes, and clear glass jars',
    body: 'We pack small daily runs in food-grade pouches, rigid boxes, and unheated glass jars—sealed the same day your order leaves our counter.',
  },
];

export function HomeSections({ onNavigate, onQuickView }: HomeSectionsProps) {
  const { products, settings, addToCart } = useNagasStore();
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const tapeARef = useRef<HTMLDivElement>(null);
  const tapeBRef = useRef<HTMLDivElement>(null);
  const ticketRef = useRef<HTMLElement>(null);
  const chapterSectionRef = useRef<HTMLElement>(null);
  const shelfSectionRef = useRef<HTMLElement>(null);
  const shelfTrackRef = useRef<HTMLDivElement>(null);
  const wipeSectionRef = useRef<HTMLElement>(null);
  const mapSectionRef = useRef<HTMLElement>(null);
  const sourcingPathRef = useRef<SVGPathElement>(null);
  const deliveryPathRef = useRef<SVGPathElement>(null);
  const mapPinRef = useRef<SVGGElement>(null);
  const scooterRef = useRef<SVGGElement>(null);

  const [activeChapter, setActiveChapter] = useState(0);
  const [wipePercent, setWipePercent] = useState(52);
  const [addedShelfId, setAddedShelfId] = useState<string | null>(null);

  // Interleave featured categories so adjacent shelf cards alternate visually
  const featuredList = products.filter((p) => p.featured);
  const featuredProducts = [
    featuredList.find((p) => p.id === 'dt-01'),
    featuredList.find((p) => p.id === 'hn-01'),
    featuredList.find((p) => p.id === 'df-01'),
    featuredList.find((p) => p.id === 'df-08'),
    featuredList.find((p) => p.id === 'dt-04'),
    featuredList.find((p) => p.id === 'hn-02'),
    featuredList.find((p) => p.id === 'df-03'),
    featuredList.find((p) => p.id === 'dt-03'),
  ].filter((p): p is Product => Boolean(p));
  const weeklyHours = getWeeklyShopHours();

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // 1. Crossed Marquee Tapes scrubbing in opposite directions
      if (tapeARef.current && tapeBRef.current) {
        gsap.fromTo(
          tapeARef.current,
          { xPercent: -8 },
          {
            xPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: tapeARef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.7,
            },
          }
        );
        gsap.fromTo(
          tapeBRef.current,
          { xPercent: 10 },
          {
            xPercent: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: tapeBRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.7,
            },
          }
        );
      }

      // 2. Word-reveal Ticket Card
      if (ticketRef.current) {
        const words = ticketRef.current.querySelectorAll('.reveal-word');
        if (words.length > 0) {
          gsap.fromTo(
            words,
            { opacity: 0.25, y: 6 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.06,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: ticketRef.current,
                start: 'top 78%',
                end: 'center 45%',
                scrub: 0.6,
              },
            }
          );
        }
      }

      // 3. Pinned Chapter Build (Desktop) + background shifts
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        if (chapterSectionRef.current) {
          ScrollTrigger.create({
            trigger: chapterSectionRef.current,
            start: 'top top',
            end: '+=1800',
            pin: true,
            scrub: 0.5,
            onUpdate: (self) => {
              const idx = Math.min(3, Math.floor(self.progress * 4));
              setActiveChapter(idx);
            },
          });
        }

        // 4. Horizontal Product Shelf Strip (Pinned pan on desktop)
        if (shelfSectionRef.current && shelfTrackRef.current) {
          const getScrollWidth = () =>
            Math.max(
              0,
              shelfTrackRef.current!.scrollWidth - window.innerWidth + 120
            );

          gsap.to(shelfTrackRef.current, {
            x: () => -getScrollWidth(),
            ease: 'none',
            scrollTrigger: {
              trigger: shelfSectionRef.current,
              start: 'top top',
              end: () => `+=${Math.max(900, getScrollWidth())}`,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
        }
      });

      // 5. Parallax polaroids
      gsap.utils.toArray<HTMLElement>('.polaroid-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: (i % 2 === 0 ? 1 : -1) * 24 },
          {
            y: (i % 2 === 0 ? -1 : 1) * 20,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.7,
            },
          }
        );
      });

      // 6. Hand-drawn Map SVG strokes + Elastic pin drop + Delivery scooter loop
      if (mapSectionRef.current) {
        [sourcingPathRef.current, deliveryPathRef.current].forEach((pathEl) => {
          if (!pathEl) return;
          const length = pathEl.getTotalLength();
          gsap.set(pathEl, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(pathEl, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: mapSectionRef.current,
              start: 'top 75%',
              end: 'center 45%',
              scrub: 0.8,
            },
          });
        });

        if (mapPinRef.current) {
          gsap.from(mapPinRef.current, {
            y: -36,
            scale: 0.6,
            opacity: 0,
            duration: 1.1,
            ease: 'elastic.out(1, 0.45)',
            scrollTrigger: {
              trigger: mapSectionRef.current,
              start: 'top 70%',
              toggleActions: 'play reverse play reverse',
            },
          });
        }

        if (scooterRef.current) {
          gsap.fromTo(
            scooterRef.current,
            { x: 0, y: 0 },
            {
              x: 215,
              y: -26,
              duration: 4.5,
              repeat: -1,
              ease: 'power1.inOut',
              yoyo: true,
            }
          );
        }
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const ticketCopyWords =
    'Every variety we pack in Trichy carries one honest weight, one clear per-pack price, and zero hidden syrup or stale mixes.'.split(
      ' '
    );

  const handleShelfQuickAdd = (product: Product) => {
    if (product.soldOut || !product.variants[0]) return;
    addToCart(product, product.variants[0].format, 1);
    setAddedShelfId(product.id);
    window.setTimeout(() => setAddedShelfId(null), 1100);
  };

  return (
    <div ref={rootRef} className="overflow-x-hidden">
      {/* 1. FULL-SCREEN HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[88vh] sm:min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#6E0B16] text-[#FFFDF7]"
      >
        {/* Background Media (Video or Image controlled by Admin) */}
        <div className="absolute inset-0">
          {settings.heroMedia.mode === 'video' && settings.heroMedia.videoUrl ? (
            <video
              key={settings.heroMedia.videoUrl}
              src={settings.heroMedia.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={settings.heroMedia.imageUrl}
              alt="Date palm oasis groves at golden hour"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover ${
                settings.heroMedia.mode === 'video' ? 'animate-ken-burns' : ''
              }`}
            />
          )}

          {/* Hero legibility wash: rgba(110, 11, 22, 0.22) + edge gradients */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(110, 11, 22, 0.22)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#6E0B16]/75 via-transparent to-[#6E0B16]/90" />
        </div>

        {/* Top Hero Strip */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-8 pt-8 flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[#FFF7EA]/90 font-medium">
            Edamalaiapatti Pudur · Trichy-620012
          </p>

          {/* Rotating Circular Stamp */}
          <div
            aria-hidden="true"
            className="w-22 h-22 sm:w-24 sm:h-24 shrink-0 relative flex items-center justify-center"
          >
            <svg
              viewBox="0 0 120 120"
              className="w-full h-full animate-stamp-spin text-[#E8A020]"
            >
              <defs>
                <path
                  id="stampCircle"
                  d="M 60, 60 m -43, 0 a 43,43 0 1,1 86,0 a 43,43 0 1,1 -86,0"
                />
              </defs>
              <text
                fill="currentColor"
                fontSize="8.4"
                fontWeight="600"
                letterSpacing="1.8"
              >
                <textPath href="#stampCircle">
                  NAGAS FOODS · TRICHY · FSSAI 22423590000134 ·
                </textPath>
              </text>
            </svg>
            <span className="absolute font-display text-xs font-bold text-[#FFFDF7]">
              100%
            </span>
          </div>
        </div>

        {/* Giant NAGAS Wordmark & Primary CTA */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-8 pb-14 sm:pb-16 pt-14">
          <p className="font-script text-2xl sm:text-3xl text-[#E8A020] mb-1">
            Purity You Can Trust, Quality You Deserve
          </p>
          <h1 className="font-display font-bold tracking-tight text-[#FFFDF7] leading-[0.86] text-[clamp(4.75rem,17vw,13.5rem)] select-none">
            NAGAS
          </h1>

          <div className="mt-6 flex flex-col items-start gap-5">
            <p className="text-base sm:text-lg text-[#FFF7EA]/90 max-w-xl leading-relaxed">
              Direct-sourced Iranian dates, cold-strained wild honey jars, and
              hand-sorted dry fruits packed fresh in Trichy.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onNavigate('products');
                  window.scrollTo({ top: 0 });
                }}
                className="px-6 py-3.5 rounded-xl bg-[#E8A020] text-[#2A1408] font-semibold text-sm inline-flex items-center gap-2 hover:bg-[#FFFDF7] transition-colors cursor-pointer"
              >
                <span>Shop All 25 Lines</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('orders');
                  window.scrollTo({ top: 0 });
                }}
                className="px-5 py-3.5 rounded-xl border border-[#FFF7EA]/40 bg-[#6E0B16]/60 text-[#FFFDF7] text-sm font-medium hover:bg-[#6E0B16]/90 transition-colors cursor-pointer"
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CROSSED MARQUEE TAPES */}
      <section
        aria-label="Sourcing highlights"
        className="relative py-10 sm:py-14 bg-[#FFF7EA] overflow-hidden"
      >
        <div
          ref={tapeARef}
          className="bg-[#A41220] text-[#FFFDF7] py-3 -rotate-2 scale-105 shadow-sm border-y border-[#FFFDF7]/20"
        >
          <div className="whitespace-nowrap flex items-center gap-8 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-8">
                <span>IRANIAN MAZAFATI DATES</span>
                <span aria-hidden="true">·</span>
                <span>UNHEATED WILD FOREST HONEY</span>
                <span aria-hidden="true">·</span>
                <span>HAND-SORTED IN TRICHY</span>
                <span aria-hidden="true">·</span>
              </span>
            ))}
          </div>
        </div>

        <div
          ref={tapeBRef}
          className="bg-[#C9962A] text-[#2A1408] py-3 rotate-2 scale-105 -mt-2 shadow-sm border-y border-[#2A1408]/15"
        >
          <div className="whitespace-nowrap flex items-center gap-8 text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-8">
                <span>100G POUCHES & GIFT BOXES</span>
                <span aria-hidden="true">·</span>
                <span>FREE DELIVERY ABOVE ₹999</span>
                <span aria-hidden="true">·</span>
                <span>FSSAI LIC. 22423590000134</span>
                <span aria-hidden="true">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WORD-REVEAL TICKET CARD */}
      <section ref={ticketRef} className="py-14 sm:py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto paper-texture ticket-notches rounded-2xl border border-[#2A1408]/15 shadow-sm px-8 sm:px-14 py-12 sm:py-16 text-center">
          <p className="font-script text-2xl sm:text-3xl text-[#A41220]">
            no guesswork
          </p>
          <h2 className="font-display text-4xl sm:text-6xl font-bold text-[#2A1408] mt-1 tracking-tight text-balance">
            Good food, plainly priced.
          </h2>
          <p className="mt-6 font-display text-xl sm:text-2xl leading-relaxed text-[#2A1408] max-w-2xl mx-auto">
            {ticketCopyWords.map((word, idx) => (
              <span key={idx} className="reveal-word inline-block mr-1.5">
                {word}
              </span>
            ))}
          </p>
          <div className="mt-8 pt-6 border-t border-dashed border-[#2A1408]/20 flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-widest text-[#2A1408]/65">
            <span>11 Dates Varieties</span>
            <span aria-hidden="true">·</span>
            <span>4 Raw Honey Jars</span>
            <span aria-hidden="true">·</span>
            <span>10 Nuts & Dry Fruits</span>
          </div>
        </div>
      </section>

      {/* 4. PINNED CHAPTER BUILD ("Care, in four chapters.") */}
      <section
        ref={chapterSectionRef}
        style={{ backgroundColor: CHAPTERS[activeChapter]?.bg ?? '#6E0B16' }}
        className="text-[#FFF7EA] py-20 lg:min-h-[85vh] px-4 sm:px-8 flex items-center transition-colors duration-500"
      >
        <div className="max-w-[1440px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[#E8A020] font-semibold">
              Our Craft
            </p>
            <h2 className="font-display text-4xl sm:text-6xl font-bold leading-tight text-balance">
              Care, in four chapters.
            </h2>

            <div className="flex flex-wrap gap-2 pt-2">
              {CHAPTERS.map((ch, idx) => (
                <button
                  key={ch.num}
                  type="button"
                  onClick={() => setActiveChapter(idx)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                    activeChapter === idx
                      ? 'bg-[#E8A020] text-[#2A1408]'
                      : 'bg-white/10 text-[#FFF7EA]/80 hover:bg-white/20'
                  }`}
                >
                  {ch.num}. {ch.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 border-l border-[#FFF7EA]/20 pl-6 sm:pl-10 space-y-4">
            <p className="font-display text-5xl sm:text-7xl font-bold text-[#E8A020] tabular-nums">
              {CHAPTERS[activeChapter].num}
            </p>
            <h3 className="font-display text-3xl sm:text-5xl font-bold text-[#FFFDF7]">
              {CHAPTERS[activeChapter].title}
            </h3>
            <p className="font-script text-2xl text-[#E8A020]">
              {CHAPTERS[activeChapter].subtitle}
            </p>
            <p className="text-base sm:text-xl text-[#FFF7EA]/85 leading-relaxed max-w-2xl">
              {CHAPTERS[activeChapter].body}
            </p>
          </div>
        </div>
      </section>

      {/* 5. HORIZONTAL PRODUCT SHELF STRIP (Photo-first 4:5 cards) */}
      <section
        ref={shelfSectionRef}
        className="py-16 lg:py-20 bg-[#FFF7EA] overflow-hidden"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#A41220] font-semibold">
              Harvest Shelf
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#2A1408] mt-1">
              Signature Pantry Cuts
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              onNavigate('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A41220] text-[#FFFDF7] text-sm font-medium hover:bg-[#6E0B16] transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View All {products.length} Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div
          ref={shelfTrackRef}
          className="flex gap-6 px-4 sm:px-8 overflow-x-auto lg:overflow-visible pb-4"
        >
          {featuredProducts.map((product) => {
            const firstVariant = product.variants[0];
            const isAdded = addedShelfId === product.id;
            return (
              <article
                key={product.id}
                className="w-[270px] sm:w-[300px] shrink-0 bg-[#FFFDF7] border border-[#2A1408]/12 rounded-2xl overflow-hidden flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => onQuickView(product)}
                  className="relative aspect-[4/5] w-full bg-[#FFF7EA] overflow-hidden cursor-pointer text-left"
                >
                  <ProductMedia
                    src={product.imageUrl}
                    alt={product.name}
                    focus={product.imageFocus}
                    className="transition-transform duration-500 hover:scale-105"
                  />
                  {product.soldOut && (
                    <div className="absolute inset-0 bg-[#2A1408]/45 flex items-center justify-center">
                      <span className="border-2 border-[#FFFDF7] text-[#FFFDF7] font-display font-bold uppercase px-3 py-1 -rotate-6 bg-[#6E0B16]/90 text-xs">
                        Sold Out
                      </span>
                    </div>
                  )}
                </button>
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-base text-[#2A1408] truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#2A1408]/65 mt-0.5 tabular-nums">
                      {firstVariant?.format} ·{' '}
                      <span className="font-semibold text-[#A41220]">
                        {firstVariant ? formatINR(firstVariant.price) : '—'}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={product.soldOut}
                    aria-label={`Add ${product.name} to cart`}
                    onClick={() => handleShelfQuickAdd(product)}
                    className={`p-2.5 rounded-xl shrink-0 transition-colors cursor-pointer disabled:opacity-40 ${
                      isAdded
                        ? 'bg-[#1E7A46] text-[#FFFDF7]'
                        : 'bg-[#A41220] text-[#FFFDF7] hover:bg-[#6E0B16]'
                    }`}
                  >
                    {isAdded ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 6. SCRIPT INTERLUDE + BEFORE / AFTER WIPE */}
      <section
        ref={wipeSectionRef}
        className="py-16 sm:py-20 px-4 sm:px-8 max-w-[1440px] mx-auto"
      >
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="font-script text-3xl sm:text-4xl text-[#A41220]">
            worth the trip
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#2A1408] mt-1">
            See what hand-sorting removes
          </h2>
          <p className="text-sm text-[#2A1408]/75 mt-2">
            Slide to compare raw incoming harvest crates with the clean,
            moisture-checked fruit that reaches your table.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#2A1408]/15 shadow-md select-none">
            {/* AFTER (Hand-sorted clean studio image) */}
            <ProductMedia
              src={IMG_DATES}
              alt="Hand-sorted glossy Iranian dates ready to pack"
              className="w-full h-full"
            />
            <div className="absolute bottom-4 right-4 bg-[#1E7A46] text-[#FFFDF7] text-xs font-semibold px-3 py-1.5 rounded-lg">
              After: Hand-Sorted NAGAS Pack
            </div>

            {/* BEFORE (Clipped left overlay) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - wipePercent}% 0 0)` }}
            >
              <img
                src={IMG_FRUITS}
                alt="Bulk orchard arrival before sorting"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover sepia-[0.25] contrast-95"
              />
              <div className="absolute bottom-4 left-4 bg-[#2A1408]/85 text-[#FFFDF7] text-xs font-semibold px-3 py-1.5 rounded-lg">
                Before: Raw Bulk Harvest Lot
              </div>
            </div>

            {/* Vertical Divider Handle */}
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 w-0.5 bg-[#FFFDF7] shadow-md pointer-events-none"
              style={{ left: `${wipePercent}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-[#A41220] text-[#FFFDF7] border-2 border-[#FFFDF7] flex items-center justify-center text-xs font-bold absolute top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md">
                ↔
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <label
              htmlFor="before-after-range"
              className="text-xs font-semibold uppercase tracking-wider text-[#2A1408]/70 shrink-0"
            >
              Compare Wipe
            </label>
            <input
              id="before-after-range"
              type="range"
              min={10}
              max={90}
              value={wipePercent}
              onChange={(e) => setWipePercent(Number(e.target.value))}
              className="w-full accent-[#A41220] cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 7. POLAROIDS + 3 STEPS */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-[#FFFDF7] border-y border-[#2A1408]/10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 grid grid-cols-3 gap-4 items-center">
            <div className="polaroid-card bg-white p-2.5 pb-6 rounded-lg shadow-md border border-[#2A1408]/10 -rotate-3">
              <div className="aspect-[4/5] overflow-hidden rounded-xs">
                <ProductMedia src={IMG_DATES} alt="Bam dates sorting" />
              </div>
              <p className="font-script text-lg text-[#2A1408] mt-2 text-center">
                Bam harvest
              </p>
            </div>
            <div className="polaroid-card bg-white p-2.5 pb-6 rounded-lg shadow-md border border-[#2A1408]/10 rotate-2 mt-6">
              <div className="aspect-[4/5] overflow-hidden rounded-xs">
                <ProductMedia src={IMG_HONEY} alt="Wild honey glass jars" />
              </div>
              <p className="font-script text-lg text-[#2A1408] mt-2 text-center">
                raw glass jars
              </p>
            </div>
            <div className="polaroid-card bg-white p-2.5 pb-6 rounded-lg shadow-md border border-[#2A1408]/10 -rotate-2">
              <div className="aspect-[4/5] overflow-hidden rounded-xs">
                <ProductMedia src={IMG_NUTS} alt="Kraft pouches packed in Trichy" />
              </div>
              <p className="font-script text-lg text-[#2A1408] mt-2 text-center">
                sealed daily
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#A41220] font-semibold">
                How Ordering Works
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2A1408] mt-1">
                From our Trichy counter in 3 steps
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: '01',
                  title: 'Pick your format',
                  desc: 'Choose 100g Pouch, 100g Box, 200g Box, or Honey Glass Jars with transparent pricing.',
                },
                {
                  step: '02',
                  title: 'Packed & sealed fresh',
                  desc: 'Orders placed before 5 PM are sorted, weighed, and dispatched the same day.',
                },
                {
                  step: '03',
                  title: 'Track to your doorstep',
                  desc: 'Follow your order from Placed to Delivered anytime using your mobile number.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-4 p-4 rounded-xl bg-[#FFF7EA] border border-[#2A1408]/10"
                >
                  <span className="font-display text-2xl font-bold text-[#A41220] tabular-nums">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[#2A1408]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#2A1408]/75 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. HOURS BLOCK + 9. FIND US ANIMATED MAPS */}
      <section
        ref={mapSectionRef}
        className="py-16 sm:py-24 px-4 sm:px-8 max-w-[1440px] mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* HOURS BLOCK */}
          <div className="lg:col-span-5 bg-[#FFFDF7] border border-[#2A1408]/12 rounded-2xl p-6 sm:p-8 shadow-xs">
            <p className="text-xs uppercase tracking-widest text-[#A41220] font-semibold">
              Store Timings
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2A1408] mt-1">
              HOURS
            </h2>
            <p className="text-xs text-[#2A1408]/65 mt-1">
              Placeholder counter hours · Edamalaiapatti Pudur, Trichy-620012
            </p>

            <ul className="mt-6 divide-y divide-[#2A1408]/10 text-sm">
              {weeklyHours.map((entry) => (
                <li
                  key={entry.day}
                  className={`py-3 flex items-center justify-between px-2 rounded-md ${
                    entry.isToday
                      ? 'bg-[#A41220]/8 text-[#A41220] font-bold'
                      : 'text-[#2A1408]/85'
                  }`}
                >
                  <span>
                    {entry.day}
                    {entry.isToday && (
                      <span className="ml-2 text-xs uppercase tracking-wider">
                        · Today
                      </span>
                    )}
                  </span>
                  <span className="tabular-nums">{entry.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FIND US — HAND-DRAWN MAPS ON A TILTED PAPER SHEET */}
          <div className="lg:col-span-7 paper-texture border border-[#2A1408]/15 rounded-2xl p-6 sm:p-8 shadow-md lg:-rotate-1">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#A41220] font-semibold">
                  Find Us & Origin Route
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2A1408]">
                  Iran → Trichy Sourcing & Local Delivery
                </h2>
              </div>
              <span className="font-script text-xl text-[#C9962A] inline-flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#A41220]" />
                <span>Edamalaiapatti Pudur</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Map 1: Iran -> Trichy Sourcing Journey */}
              <div className="bg-[#FFF7EA] rounded-xl p-4 border border-[#2A1408]/12">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#2A1408]/70 mb-2">
                  Sourcing Journey (Bam → Trichy)
                </p>
                <svg
                  viewBox="0 0 300 180"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Hand-drawn sourcing map from Bam Iran to Trichy Tamil Nadu"
                >
                  {/* Subtle hand-drawn landmass contours */}
                  <path
                    d="M 15 50 Q 55 25 100 45 T 145 75 Q 115 110 75 95 T 15 50 Z"
                    fill="#F3E4CA"
                    stroke="#2A1408"
                    strokeOpacity="0.2"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 195 75 Q 235 60 270 95 L 245 160 Q 220 168 205 145 Z"
                    fill="#F3E4CA"
                    stroke="#2A1408"
                    strokeOpacity="0.2"
                    strokeWidth="1.5"
                  />
                  {/* Animated route stroke */}
                  <path
                    ref={sourcingPathRef}
                    d="M 65 62 C 110 22, 185 35, 232 135"
                    fill="none"
                    stroke="#A41220"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="65" cy="62" r="5" fill="#C9962A" />
                  <text
                    x="38"
                    y="82"
                    fontSize="10"
                    fontWeight="600"
                    fill="#2A1408"
                  >
                    Bam, Iran
                  </text>
                  <circle cx="232" cy="135" r="6" fill="#A41220" />
                  <text
                    x="198"
                    y="156"
                    fontSize="10"
                    fontWeight="700"
                    fill="#A41220"
                  >
                    Trichy 620012
                  </text>
                </svg>
              </div>

              {/* Map 2: Local Trichy Delivery Map + Elastic Pin + Scooter */}
              <div className="bg-[#FFF7EA] rounded-xl p-4 border border-[#2A1408]/12">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#2A1408]/70 mb-2">
                  Local Trichy Delivery Route
                </p>
                <svg
                  viewBox="0 0 300 180"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Local Trichy delivery route map with live delivery scooter"
                >
                  {/* Hand-drawn Trichy street lines */}
                  <path
                    d="M 15 140 L 285 110 M 35 45 L 265 65 M 110 20 L 95 165 M 215 20 L 235 165"
                    stroke="#2A1408"
                    strokeOpacity="0.18"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  {/* Active Delivery Route */}
                  <path
                    ref={deliveryPathRef}
                    d="M 40 135 Q 140 110 255 108"
                    fill="none"
                    stroke="#1E7A46"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Elastic Pin at Store */}
                  <g ref={mapPinRef}>
                    <circle cx="48" cy="132" r="7" fill="#A41220" />
                    <path
                      d="M 48 112 C 41 112 37 118 37 123 C 37 130 48 140 48 140 C 48 140 59 130 59 123 C 59 118 55 112 48 112 Z"
                      fill="#A41220"
                    />
                    <circle cx="48" cy="122" r="3" fill="#FFFDF7" />
                  </g>
                  <text
                    x="18"
                    y="162"
                    fontSize="9.5"
                    fontWeight="700"
                    fill="#2A1408"
                  >
                    NAGAS Store
                  </text>
                  <text
                    x="176"
                    y="94"
                    fontSize="9.5"
                    fontWeight="600"
                    fill="#1E7A46"
                  >
                    Thillai Nagar / Srirangam
                  </text>

                  {/* Looping Delivery Scooter */}
                  <g ref={scooterRef}>
                    <g transform="translate(36, 118)">
                      <rect
                        x="0"
                        y="0"
                        width="18"
                        height="11"
                        rx="3"
                        fill="#E8A020"
                        stroke="#2A1408"
                        strokeWidth="1.2"
                      />
                      <circle cx="4" cy="13" r="3" fill="#2A1408" />
                      <circle cx="15" cy="13" r="3" fill="#2A1408" />
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS & CONTACT PREVIEW */}
      <ContactSection />
    </div>
  );
}
