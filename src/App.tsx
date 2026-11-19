import { useEffect, useState } from 'react';
import { StoreProvider } from './store/StoreContext';
import type { AppView, Product } from './types/commerce';
import { Navbar } from './components/Navbar';
import { HomeSections } from './components/HomeSections';
import { ProductsPage } from './components/ProductsPage';
import { AboutPage } from './components/AboutPage';
import { MyOrdersPage } from './components/MyOrdersPage';
import { ContactSection } from './components/ContactSection';
import { AdminPanel } from './components/AdminPanel';
import { SearchOverlay } from './components/SearchOverlay';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { Footer } from './components/Footer';

function NagasShell() {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackPhone, setTrackPhone] = useState('');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const [scrollTick, setScrollTick] = useState(0);

  useEffect(() => {
    if (activeView === 'visit' || activeView === 'testimonials') {
      const targetId =
        activeView === 'visit' ? 'find-us-section' : 'testimonials-section';
      const timer = window.setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 120);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0 });
  }, [activeView, scrollTick]);

  const navigate = (view: AppView) => {
    setActiveView(view);
    setScrollTick((t) => t + 1);
  };

  const handleTrackOrder = (phone: string) => {
    setTrackPhone(phone);
    navigate('orders');
  };

  const isHomeCanvas =
    activeView === 'home' ||
    activeView === 'visit' ||
    activeView === 'testimonials';

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF7EA] text-[#2A1408]">
      <Navbar
        activeView={activeView}
        onNavigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <main className="flex-1">
        {isHomeCanvas && (
          <HomeSections
            onNavigate={navigate}
            onQuickView={setQuickViewProduct}
          />
        )}
        {activeView === 'products' && (
          <ProductsPage onQuickView={setQuickViewProduct} />
        )}
        {activeView === 'about' && (
          <AboutPage onBrowseProducts={() => navigate('products')} />
        )}
        {activeView === 'orders' && <MyOrdersPage initialPhone={trackPhone} />}
        {activeView === 'contact' && <ContactSection standalone />}
        {activeView === 'admin' && <AdminPanel />}
      </main>

      <Footer onNavigate={navigate} />
      <WhatsAppFloat />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onQuickView={setQuickViewProduct}
      />

      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <CartDrawer
        onProceedToCheckout={() => setCheckoutOpen(true)}
        onBrowseProducts={() => navigate('products')}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onTrackOrder={handleTrackOrder}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <NagasShell />
    </StoreProvider>
  );
}
