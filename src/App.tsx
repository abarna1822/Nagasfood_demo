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

  const handleTrackOrder = (phone: string) => {
    setTrackPhone(phone);
    setActiveView('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF7EA] text-[#2A1408]">
      <Navbar
        activeView={activeView}
        onNavigate={setActiveView}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <main className="flex-1">
        {activeView === 'home' && (
          <HomeSections
            onNavigate={setActiveView}
            onQuickView={setQuickViewProduct}
          />
        )}
        {activeView === 'products' && (
          <ProductsPage onQuickView={setQuickViewProduct} />
        )}
        {activeView === 'about' && (
          <AboutPage onBrowseProducts={() => setActiveView('products')} />
        )}
        {activeView === 'orders' && <MyOrdersPage initialPhone={trackPhone} />}
        {activeView === 'contact' && <ContactSection standalone />}
        {activeView === 'admin' && <AdminPanel />}
      </main>

      <Footer onNavigate={setActiveView} />
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
        onBrowseProducts={() => setActiveView('products')}
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
