import { useState } from 'react';
import { Menu, Search, ShoppingBag, ShieldCheck, X } from 'lucide-react';
import { useNagasStore } from '../store/StoreContext';
import type { AppView } from '../types/commerce';

interface NavbarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenSearch: () => void;
}

const NAV_LINKS: Array<{ view: AppView; label: string }> = [
  { view: 'home', label: 'Home' },
  { view: 'products', label: 'Products' },
  { view: 'about', label: 'About' },
  { view: 'orders', label: 'My Orders' },
  { view: 'contact', label: 'Contact' },
];

export function Navbar({ activeView, onNavigate, onOpenSearch }: NavbarProps) {
  const { cart, settings, setIsCartOpen } = useNagasStore();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="sticky top-0 z-40">
      {!bannerDismissed && settings.announcementText.trim() && (
        <div className="bg-[#6E0B16] text-[#FFF7EA] text-xs py-1.5 px-4 flex items-center justify-center relative">
          <p className="truncate max-w-[85vw] tracking-wide font-medium">
            {settings.announcementText}
          </p>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss announcement"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#FFF7EA]/80 hover:text-[#FFF7EA] focus-visible:outline-2 focus-visible:outline-[#E8A020]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="bg-[#FFF7EA]/95 backdrop-blur-md border-b border-[#2A1408]/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#A41220] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#A41220] rounded"
          >
            NAGAS
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.view}
                  type="button"
                  onClick={() => handleNavClick(link.view)}
                  className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A41220] ${
                    isActive
                      ? 'border-[#A41220] text-[#A41220]'
                      : 'border-transparent text-[#2A1408]/80 hover:text-[#A41220]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Compact action controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search products"
              className="p-2.5 rounded-lg text-[#2A1408] hover:bg-[#2A1408]/5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A41220]"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              aria-label="Admin Portal"
              title="Admin Portal"
              className={`p-2.5 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A41220] ${
                activeView === 'admin'
                  ? 'bg-[#6E0B16] text-[#FFFDF7]'
                  : 'text-[#2A1408]/80 hover:bg-[#2A1408]/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open cart with ${totalQty} items`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A41220] text-[#FFFDF7] text-sm font-medium hover:bg-[#6E0B16] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A1408]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              <span className="tabular-nums font-semibold">({totalQty})</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2.5 rounded-lg text-[#2A1408] hover:bg-[#2A1408]/5 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="md:hidden border-t border-[#2A1408]/10 bg-[#FFFDF7] px-4 py-3 flex flex-col gap-1"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.view}
                  type="button"
                  onClick={() => handleNavClick(link.view)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#A41220] text-[#FFFDF7]'
                      : 'text-[#2A1408] hover:bg-[#FFF7EA]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'admin'
                  ? 'bg-[#6E0B16] text-[#FFFDF7]'
                  : 'text-[#2A1408] hover:bg-[#FFF7EA]'
              }`}
            >
              Admin Dashboard
            </button>
          </nav>
        )}
      </header>
    </div>
  );
}
