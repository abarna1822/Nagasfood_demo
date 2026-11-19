import { useEffect, useState } from 'react';
import { Menu, MessageCircle, Search, ShoppingBag, X } from 'lucide-react';
import { useNagasStore } from '../store/StoreContext';
import type { AppView } from '../types/commerce';
import { buildWhatsAppHref } from '../utils/commerce';

interface NavbarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenSearch: () => void;
}

const DESKTOP_LINKS: Array<{ view: AppView; label: string }> = [
  { view: 'home', label: 'Home' },
  { view: 'about', label: 'About' },
  { view: 'products', label: 'Products' },
  { view: 'testimonials', label: 'Testimonials' },
  { view: 'visit', label: 'Find Us' },
  { view: 'contact', label: 'Contact' },
];

const MOBILE_LINKS: Array<{ view: AppView; label: string }> = [
  { view: 'home', label: 'Home' },
  { view: 'about', label: 'About' },
  { view: 'products', label: 'Products' },
  { view: 'testimonials', label: 'Testimonials' },
  { view: 'visit', label: 'Find Us' },
  { view: 'orders', label: 'My Orders' },
  { view: 'contact', label: 'Contact' },
];

export function Navbar({ activeView, onNavigate, onOpenSearch }: NavbarProps) {
  const { cart, settings, setIsCartOpen } = useNagasStore();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (view: AppView) => {
    setMobileMenuOpen(false);
    onNavigate(view);
  };

  const waHref = buildWhatsAppHref(
    settings.whatsappNumber,
    'Hello NAGAS FOODS Trichy! I would like to know more about your dates, honey, and dry fruits.'
  );

  return (
    <header className="fixed inset-x-0 top-2 sm:top-4 z-[120] px-2.5 sm:px-5 transition-transform duration-300">
      {/* Gold Pill Announcement Bar */}
      {!bannerDismissed && settings.announcementText.trim() && (
        <div className="max-w-[1500px] mx-auto mb-1.5 sm:mb-2 min-h-[28px] sm:min-h-[30px] px-8 py-1.5 rounded-full bg-[#C9962A] text-[#2A1408] text-[10.5px] sm:text-[12px] font-semibold tracking-[0.12em] sm:tracking-[0.16em] uppercase leading-snug shadow-[0_10px_26px_rgba(74,36,16,0.14)] flex items-center justify-center relative">
          <p className="truncate max-w-[88vw] text-center">
            {settings.announcementText}
          </p>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss announcement"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#2A1408]/75 hover:text-[#2A1408] hover:bg-[#2A1408]/10 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Frosted Glass Pill Navbar */}
      <div
        className={`max-w-[1500px] mx-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:gap-5 min-h-[54px] sm:min-h-[60px] py-1.5 sm:py-2 pl-2.5 sm:pl-3 pr-2 sm:pr-2.5 rounded-full border border-[#2A1408]/11 backdrop-blur-[18px] saturate-[1.15] transition-all duration-300 ${
          scrolled
            ? 'bg-[#FFFDF7]/97 shadow-[0_16px_42px_rgba(74,36,16,0.14)]'
            : 'bg-[#FFFDF7]/93 shadow-[0_14px_38px_rgba(42,20,8,0.12)]'
        }`}
      >
        {/* Left: Brand Badge + Stacked Wordmark + 6 Single-line Links */}
        <div className="flex items-center gap-3.5 lg:gap-6 min-w-0">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            aria-label="NAGAS FOODS — go to home"
            className="flex items-center gap-2.5 shrink-0 text-left cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-[#C9962A]"
          >
            <span
              aria-hidden="true"
              className="w-[37px] h-[37px] sm:w-[39px] sm:h-[39px] rounded-full bg-[#6E0B16] text-[#FFF7EA] font-display text-[21px] sm:text-[23px] font-semibold leading-none grid place-items-center shadow-[inset_0_0_0_1px_rgba(255,247,234,0.16)] shrink-0"
            >
              N
            </span>
            <span className="hidden md:flex flex-col gap-[2px]">
              <span className="font-display text-[14px] font-semibold leading-[0.9] tracking-[0.12em] text-[#6E0B16]">
                NAGAS
              </span>
              <span className="text-[10.5px] font-semibold leading-none tracking-[0.25em] uppercase text-[#2A1408]/58">
                FOODS · TRICHY
              </span>
            </span>
          </button>

          <nav
            aria-label="Primary Navigation"
            className="hidden xl:flex items-center gap-4 2xl:gap-5"
          >
            {DESKTOP_LINKS.map((link) => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.view}
                  type="button"
                  onClick={() => handleNavClick(link.view)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1.5 text-[12px] font-medium tracking-[0.1em] uppercase whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C9962A] ${
                    isActive
                      ? 'text-[#A41220] after:opacity-100 after:translate-y-0'
                      : 'text-[#2A1408] hover:text-[#A41220] after:opacity-0 after:translate-y-1'
                  } after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:-translate-x-1/2 after:w-[3px] after:h-[3px] after:rounded-full after:bg-[#A41220] after:transition-all after:duration-300`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Search Circle + Green WhatsApp Pill + Cart Pill + Mobile Toggle */}
        <div className="flex items-center gap-[7px] shrink-0 justify-self-end">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search products"
            className="hidden md:grid place-items-center w-[39px] h-[39px] rounded-full border border-[#2A1408]/17 bg-[#FFF7EA] text-[#2A1408] hover:bg-[#FFFDF7] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(74,36,16,0.12)] transition-all cursor-pointer"
          >
            <Search className="w-[17px] h-[17px]" />
          </button>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with NAGAS FOODS on WhatsApp"
            className="hidden lg:inline-flex items-center justify-center gap-2 h-[39px] px-3.5 rounded-full bg-[#1E7A46] text-white border border-[#1E7A46] text-[12px] font-semibold tracking-[0.12em] uppercase hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(30,122,70,0.28)] transition-all whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span className="hidden xl:inline">WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Open cart with ${totalQty} items`}
            className="inline-flex items-center gap-2 h-[36px] md:h-[39px] px-3 md:px-4 rounded-full border border-[#2A1408]/17 bg-[#FFF7EA] text-[#2A1408] text-[12.5px] font-semibold tracking-[0.1em] uppercase hover:bg-[#FFFDF7] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(74,36,16,0.12)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">Cart</span>
            <span className="grid place-items-center min-w-[20px] h-[20px] px-1 rounded-full bg-[#A41220] text-[#FFF7EA] text-[12px] leading-none tracking-normal tabular-nums">
              {totalQty}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="xl:hidden inline-flex items-center justify-center w-[36px] h-[36px] md:w-[41px] md:h-[41px] rounded-full border border-[#2A1408]/17 text-[#2A1408] bg-transparent hover:bg-[#2A1408]/5 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Rounded Mobile Menu Card */}
      {mobileMenuOpen && (
        <div className="xl:hidden max-w-[1500px] mx-auto mt-2.5 p-3.5 bg-[#FFFDF7]/98 border border-[#2A1408]/11 rounded-[26px] shadow-[0_26px_70px_rgba(74,36,16,0.14)] backdrop-blur-[18px]">
          <nav
            aria-label="Mobile Primary Navigation"
            className="grid grid-cols-2 gap-1"
          >
            {MOBILE_LINKS.map((link) => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.view}
                  type="button"
                  onClick={() => handleNavClick(link.view)}
                  className={`text-left px-3 py-3 rounded-[13px] text-[14px] font-medium tracking-[0.09em] uppercase transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#FFF7EA] text-[#A41220] font-semibold'
                      : 'text-[#2A1408] hover:bg-[#FFF7EA]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
              className="text-left px-3 py-3 rounded-[13px] text-[14px] font-medium tracking-[0.09em] uppercase text-[#2A1408] hover:bg-[#FFF7EA] cursor-pointer"
            >
              Cart ({totalQty})
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="col-span-2 text-left px-3 py-2.5 rounded-[13px] text-[13px] font-medium tracking-[0.09em] uppercase text-[#2A1408]/80 hover:bg-[#FFF7EA] flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search Catalogue</span>
            </button>
          </nav>

          <div className="flex items-center justify-between gap-3.5 mt-2.5 pt-3 px-3 border-t border-[#2A1408]/10">
            <small className="text-[12px] tracking-[0.11em] uppercase text-[#2A1408]/60 leading-relaxed">
              Original Iranian
              <br />
              Kimia dates
            </small>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-4 rounded-full bg-[#1E7A46] text-white text-[12px] font-semibold tracking-[0.12em] uppercase"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
