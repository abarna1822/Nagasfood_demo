import type { AppView } from '../types/commerce';
import { useNagasStore } from '../store/StoreContext';
import { buildWhatsAppHref } from '../utils/commerce';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { settings } = useNagasStore();

  const go = (view: AppView) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#6E0B16] text-[#FFF7EA] pt-16 pb-10 px-4 sm:px-8 border-t border-[#C9962A]/25">
      <div className="max-w-[1440px] mx-auto">
        <div className="border-b border-[#FFF7EA]/15 pb-10">
          <p className="text-xs uppercase tracking-[0.22em] text-[#E8A020] font-semibold">
            NAGAS FOODS · TRICHY
          </p>
          <h2 className="font-display font-bold tracking-tight text-[#FFFDF7] leading-[0.88] text-[clamp(4rem,13vw,11rem)] mt-3 select-none">
            TASTE IT.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10 text-sm">
          <div className="md:col-span-5 space-y-2">
            <p className="font-display text-xl font-bold text-[#FFFDF7]">
              NAGAS FOODS, Trichy
            </p>
            <p className="text-[#FFF7EA]/80">
              "Purity You Can Trust, Quality You Deserve"
            </p>
            <p className="text-[#FFF7EA]/75 pt-1">
              Edamalaiapatti Pudur, Trichy-620012, Tamil Nadu
            </p>
            <p className="text-[#FFF7EA]/75 tabular-nums">
              FSSAI Lic. No: 22423590000134
            </p>
          </div>

          <div className="md:col-span-3 space-y-2">
            <p className="text-xs uppercase tracking-widest text-[#E8A020] font-semibold">
              Explore
            </p>
            <ul className="space-y-1.5">
              {(
                [
                  ['home', 'Home'],
                  ['products', 'All 25 Products'],
                  ['about', 'Sourcing & Story'],
                  ['orders', 'Track My Orders'],
                  ['contact', 'Contact & Hours'],
                  ['admin', 'Admin Dashboard'],
                ] as Array<[AppView, string]>
              ).map(([view, label]) => (
                <li key={view}>
                  <button
                    type="button"
                    onClick={() => go(view)}
                    className="text-[#FFF7EA]/85 hover:text-[#E8A020] transition-colors cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2">
            <p className="text-xs uppercase tracking-widest text-[#E8A020] font-semibold">
              Customer Care & Delivery
            </p>
            <p className="text-[#FFF7EA]/85 tabular-nums">
              WhatsApp / Call: {settings.whatsappNumber}
            </p>
            <p className="text-[#FFF7EA]/85">Email: nagasfoodstrichy@gmail.com</p>
            <p className="text-xs text-[#FFF7EA]/65 pt-2">
              Delivery ₹{settings.deliveryFee} · Free above ₹
              {settings.freeDeliveryThreshold}. Draft catalogue prices & shop
              hours (Mon–Sat 9:00–21:00, Sun 10:00–14:00) subject to final store
              confirmation.
            </p>
            <div className="pt-2">
              <a
                href={buildWhatsAppHref(
                  settings.whatsappNumber,
                  'Hi NAGAS FOODS Trichy, I have a question about an order.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#1E7A46] text-[#FFFDF7] text-xs font-medium hover:bg-[#166036] transition-colors"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#FFF7EA]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#FFF7EA]/60">
          <p>© {new Date().getFullYear()} NAGAS FOODS, Trichy. All rights reserved.</p>
          <p>Local storage storefront demo · Payments simulated for preview</p>
        </div>
      </div>
    </footer>
  );
}
