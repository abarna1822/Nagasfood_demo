import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useNagasStore } from '../store/StoreContext';
import type { Product, ProductCategory } from '../types/commerce';
import { filterProducts } from '../utils/commerce';
import { ProductCard } from './ProductCard';

interface ProductsPageProps {
  onQuickView: (product: Product) => void;
}

export function ProductsPage({ onQuickView }: ProductsPageProps) {
  const { products } = useNagasStore();
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    return {
      all: products.length,
      dates: products.filter((p) => p.category === 'dates').length,
      honey: products.filter((p) => p.category === 'honey').length,
      'dry-fruits': products.filter((p) => p.category === 'dry-fruits').length,
    };
  }, [products]);

  const filtered = useMemo(
    () => filterProducts(products, query, category),
    [products, query, category]
  );

  const tabs: Array<{ id: ProductCategory | 'all'; label: string; count: number }> = [
    { id: 'all', label: 'All Lines', count: counts.all },
    { id: 'dates', label: 'Dates Harvest', count: counts.dates },
    { id: 'honey', label: 'Raw Honey Jars', count: counts.honey },
    { id: 'dry-fruits', label: 'Nuts & Dry Fruits', count: counts['dry-fruits'] },
  ];

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#2A1408]/10">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#A41220] font-semibold">
            Trichy Pantry Catalogue
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#2A1408] mt-1">
            25 Hand-Sorted Lines
          </h1>
          <p className="text-sm text-[#2A1408]/75 mt-2 max-w-xl">
            Every pouch and box is weighed, inspected, and sealed in Edamalaiapatti Pudur.
            Choose your preferred pack format directly on any card.
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-[#2A1408]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <label htmlFor="catalogue-search" className="sr-only">
            Filter catalogue
          </label>
          <input
            id="catalogue-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name or origin..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#2A1408]/20 bg-[#FFFDF7] text-sm focus:outline-none focus:border-[#A41220]"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap items-center gap-2 py-6">
        {tabs.map((tab) => {
          const active = category === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategory(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#6E0B16] text-[#FFFDF7]'
                  : 'bg-[#FFFDF7] text-[#2A1408] border border-[#2A1408]/15 hover:border-[#A41220]'
              }`}
            >
              {tab.label} <span className="tabular-nums opacity-75">({tab.count})</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-[#FFFDF7] rounded-2xl border border-[#2A1408]/10">
          <p className="font-display text-xl font-semibold text-[#2A1408]">
            No products matched "{query}"
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-[#A41220] text-[#FFFDF7] text-sm font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </section>
  );
}
