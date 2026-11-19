import { useEffect, useState } from 'react';
import { Check, PackageSearch, Phone } from 'lucide-react';
import { useNagasStore } from '../store/StoreContext';
import {
  formatINR,
  getOrderStageIndex,
  normalizePhone,
  ORDER_STAGES,
} from '../utils/commerce';

interface MyOrdersPageProps {
  initialPhone?: string;
}

export function MyOrdersPage({ initialPhone = '' }: MyOrdersPageProps) {
  const { findOrdersByPhone } = useNagasStore();
  const [phoneInput, setPhoneInput] = useState(initialPhone || '9876543210');
  const [searchedPhone, setSearchedPhone] = useState(
    initialPhone || '9876543210'
  );

  useEffect(() => {
    if (initialPhone) {
      setPhoneInput(initialPhone);
      setSearchedPhone(initialPhone);
    }
  }, [initialPhone]);

  const matchedOrders = findOrdersByPhone(searchedPhone);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedPhone(phoneInput);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-16">
      <div className="text-center max-w-xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-[#A41220] font-semibold">
          Live Order Tracker
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#2A1408] mt-1">
          My Orders
        </h1>
        <p className="text-sm text-[#2A1408]/75 mt-2">
          Enter the 10-digit mobile number used during checkout to inspect your
          order across all 5 fulfilment stages.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="mt-8 bg-[#FFFDF7] p-4 sm:p-5 rounded-2xl border border-[#2A1408]/15 shadow-sm flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Phone className="w-4 h-4 text-[#2A1408]/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <label htmlFor="track-phone-input" className="sr-only">
            Mobile number to track orders
          </label>
          <input
            id="track-phone-input"
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="Enter 10-digit phone (e.g., 9876543210)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#2A1408]/20 bg-white text-sm tabular-nums focus:outline-none focus:border-[#A41220]"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-[#A41220] text-[#FFFDF7] text-sm font-medium hover:bg-[#6E0B16] transition-colors whitespace-nowrap cursor-pointer"
        >
          Find Orders
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-[#2A1408]/65">
        <span>Demo numbers:</span>
        {['9876543210', '6379178126'].map((demo) => (
          <button
            key={demo}
            type="button"
            onClick={() => {
              setPhoneInput(demo);
              setSearchedPhone(demo);
            }}
            className="underline hover:text-[#A41220] tabular-nums cursor-pointer"
          >
            {demo}
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-6">
        {matchedOrders.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#FFFDF7] border border-[#2A1408]/10 text-center">
            <PackageSearch className="w-10 h-10 text-[#2A1408]/30 mx-auto mb-3" />
            <p className="font-display text-xl font-semibold text-[#2A1408]">
              No orders found for {normalizePhone(searchedPhone) || 'this number'}
            </p>
            <p className="text-sm text-[#2A1408]/65 mt-1">
              Double-check your mobile number or place a new order from the catalogue.
            </p>
          </div>
        ) : (
          matchedOrders.map((order) => {
            const currentStageIdx = getOrderStageIndex(order.stage);
            return (
              <article
                key={order.id}
                className="bg-[#FFFDF7] border border-[#2A1408]/15 rounded-2xl p-6 shadow-xs space-y-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#2A1408]/10">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#2A1408]/60">
                      Order ID
                    </p>
                    <h2 className="font-display text-2xl font-bold text-[#2A1408] tabular-nums">
                      {order.id}
                    </h2>
                    <p className="text-xs text-[#2A1408]/65 mt-0.5">
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}{' '}
                      · {order.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-[#2A1408]/60">
                      Total
                    </p>
                    <p className="font-display text-2xl font-bold text-[#A41220] tabular-nums">
                      {formatINR(order.total)}
                    </p>
                    <p className="text-xs font-semibold text-[#1E7A46] mt-0.5">
                      Status: {order.stage}
                    </p>
                  </div>
                </div>

                {/* 5-Stage Progress Tracker */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#2A1408]/60 mb-4">
                    Fulfilment Progress
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {ORDER_STAGES.map((stage, idx) => {
                      const done = idx <= currentStageIdx;
                      const current = idx === currentStageIdx;
                      return (
                        <div key={stage} className="flex flex-col items-center text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                              done
                                ? 'bg-[#1E7A46] border-[#1E7A46] text-[#FFFDF7]'
                                : 'bg-[#FFF7EA] border-[#2A1408]/20 text-[#2A1408]/45'
                            } ${current ? 'ring-4 ring-[#1E7A46]/20' : ''}`}
                          >
                            {done ? <Check className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`mt-2 text-xs font-medium ${
                              done ? 'text-[#2A1408]' : 'text-[#2A1408]/45'
                            }`}
                          >
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items + Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#2A1408]/10 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#2A1408]/60 mb-2">
                      Items Packed
                    </p>
                    <ul className="space-y-1.5">
                      {order.items.map((item) => (
                        <li
                          key={`${item.productId}-${item.format}`}
                          className="flex justify-between text-[#2A1408]/85"
                        >
                          <span>
                            {item.productName} ({item.format}) × {item.quantity}
                          </span>
                          <span className="tabular-nums font-medium">
                            {formatINR(item.unitPrice * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#FFF7EA] p-3.5 rounded-xl">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#2A1408]/60 mb-1">
                      Shipping Address
                    </p>
                    <p className="font-medium text-[#2A1408]">
                      {order.customer.name}
                    </p>
                    <p className="text-xs text-[#2A1408]/75 mt-0.5">
                      {order.customer.address}, {order.customer.city} –{' '}
                      {order.customer.pincode}
                    </p>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
