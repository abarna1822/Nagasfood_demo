import { MessageCircle } from 'lucide-react';
import { useNagasStore } from '../store/StoreContext';
import { buildWhatsAppHref } from '../utils/commerce';

export function WhatsAppFloat() {
  const { settings } = useNagasStore();

  return (
    <a
      href={buildWhatsAppHref(
        settings.whatsappNumber,
        'Hello NAGAS FOODS Trichy! I would like to order fresh dates, honey, or dry fruits.'
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat or order via WhatsApp"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1E7A46] text-[#FFFDF7] shadow-lg hover:bg-[#166036] transition-transform hover:-translate-y-0.5 text-sm font-medium"
    >
      <MessageCircle className="w-4 h-4 shrink-0" />
      <span className="hidden sm:inline">WhatsApp Order</span>
    </a>
  );
}
