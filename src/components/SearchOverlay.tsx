import { useEffect, useRef, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import type { Product } from '../types/commerce';
import { filterProducts, formatINR } from '../utils/commerce';
import { useNagasStore } from '../store/StoreContext';
import { ProductMedia } from './ProductMedia';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onQuickView: (product: Product) => void;
}

export function SearchOverlay({
  open,
  onClose,
  onQuickView,
}: SearchOverlayProps) {
  const { products, addToCart } = useNagasStore();
  const [query, setQuery] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const matches = filterProducts(products, query, 'all').slice(0, 8);

  const handleQuickAdd = (product: Product) => {
    if (product.soldOut || !product.variants[0]) return;
    addToCart(product, product.variants[0].format, 1);
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Live Product Search"
      className="fixed inset-0 z-50 bg-[#2A1408]/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FFFDF7] rounded-2xl shadow-2xl border border-[#2A1408]/15 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2A1408]/10">
          <Search className="w-5 h-5 text-[#A41220] shrink-0" />
          <label htmlFor="live-search-input" className="sr-only">
            Search dates, honey, nuts, and dry fruits
          </label>
          <input
            id="live-search-input"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Ajwa, Mazafati, Raw Honey, Walnut, Anjeer..."
            className="flex-1 bg-transparent text-[#2A1408] placeholder:text-[#2A1408]/45 text-base focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-lg text-[#2A1408]/70 hover:bg-[#2A1408]/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto divide-y divide-[#2A1408]/8">
          {matches.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-display text-lg font-semibold text-[#2A1408]">
                No matches for "{query}"
              </p>
              <p className="text-sm text-[#2A1408]/65 mt-1">
                Try searching by fruit, origin (Bam, Kashmir, Madinah), or pack type.
              </p>
            </div>
          ) : (
            matches.map((product) => {
              const firstVariant = product.variants[0];
              const isJustAdded = addedId === product.id;
              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-[#FFF7EA]/70 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onQuickView(product);
                    }}
                    className="flex items-center gap-3.5 text-left flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#FFF7EA]">
                      <ProductMedia
                        src={product.imageUrl}
                        alt={product.name}
                        focus={product.imageFocus}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-semibold text-[#2A1408] truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-[#2A1408]/65 truncate">
                        {product.origin} · {firstVariant?.format} ·{' '}
                        <span className="font-semibold text-[#A41220] tabular-nums">
                          {firstVariant ? formatINR(firstVariant.price) : '—'}
                        </span>
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    {product.soldOut ? (
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#6E0B16]">
                        Sold Out
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                          isJustAdded
                            ? 'bg-[#1E7A46] text-[#FFFDF7]'
                            : 'bg-[#A41220] text-[#FFFDF7] hover:bg-[#6E0B16]'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isJustAdded ? 'Added' : 'Quick Add'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
