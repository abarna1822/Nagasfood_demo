import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { useNagasStore } from '../store/StoreContext';
import {
  calculateDeliveryFee,
  calculateFreeDeliveryProgress,
  calculateSubtotal,
  formatINR,
} from '../utils/commerce';
import { ProductMedia } from './ProductMedia';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onBrowseProducts: () => void;
}

export function CartDrawer({
  onProceedToCheckout,
  onBrowseProducts,
}: CartDrawerProps) {
  const {
    cart,
    settings,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
  } = useNagasStore();

  if (!isCartOpen) return null;

  const subtotal = calculateSubtotal(cart);
  const deliveryFee = calculateDeliveryFee(
    subtotal,
    settings.deliveryFee,
    settings.freeDeliveryThreshold
  );
  const total = subtotal + deliveryFee;
  const progress = calculateFreeDeliveryProgress(
    subtotal,
    settings.freeDeliveryThreshold
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      className="fixed inset-0 z-[150] bg-[#2A1408]/60 backdrop-blur-xs flex justify-end"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="w-full max-w-md bg-[#FFFDF7] h-full shadow-2xl flex flex-col border-l border-[#2A1408]/15"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#2A1408]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#A41220]" />
            <h2 className="font-display text-xl font-bold text-[#2A1408]">
              Your Pantry Cart
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="p-2 rounded-lg text-[#2A1408]/70 hover:bg-[#2A1408]/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free-delivery progress bar */}
        <div className="px-6 py-3.5 bg-[#FFF7EA] border-b border-[#2A1408]/10">
          <div className="flex items-center gap-2 text-xs font-medium text-[#2A1408]">
            <Truck className="w-4 h-4 text-[#A41220] shrink-0" />
            {cart.length === 0 ? (
              <span>
                Delivery fee {formatINR(settings.deliveryFee)} · Free above{' '}
                {formatINR(settings.freeDeliveryThreshold)}
              </span>
            ) : progress.isFree ? (
              <span className="text-[#1E7A46] font-semibold">
                Free delivery unlocked on this order
              </span>
            ) : (
              <span>
                Add{' '}
                <strong className="tabular-nums text-[#A41220]">
                  {formatINR(progress.amountRemaining)}
                </strong>{' '}
                more for free delivery (orders{' '}
                {formatINR(settings.freeDeliveryThreshold)}+)
              </span>
            )}
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-[#2A1408]/10 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                progress.isFree ? 'bg-[#1E7A46]' : 'bg-[#E8A020]'
              }`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#2A1408]/10">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-10 h-10 text-[#2A1408]/25 mb-3" />
              <p className="font-display text-lg font-semibold text-[#2A1408]">
                Your cart is empty
              </p>
              <p className="text-sm text-[#2A1408]/65 mt-1 max-w-xs">
                Explore 25 hand-sorted dates, wild honey jars, and dry fruits packed fresh in Trichy.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  onBrowseProducts();
                }}
                className="mt-5 px-5 py-2.5 rounded-lg bg-[#A41220] text-[#FFFDF7] text-sm font-medium hover:bg-[#6E0B16] transition-colors cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.format}`}
                className="py-4 flex gap-3.5 items-start"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#FFF7EA] shrink-0">
                  <ProductMedia src={item.imageUrl} alt={item.productName} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-semibold text-[#2A1408] text-sm leading-snug">
                      {item.productName}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId, item.format)}
                      aria-label={`Remove ${item.productName} (${item.format})`}
                      className="p-1 text-[#2A1408]/45 hover:text-[#A41220] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-[#2A1408]/65 mt-0.5">{item.format}</p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="inline-flex items-center border border-[#2A1408]/15 rounded-md bg-[#FFF7EA]">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.productName}`}
                        onClick={() =>
                          updateCartQuantity(item.productId, item.format, -1)
                        }
                        className="p-1.5 text-[#2A1408] hover:bg-[#2A1408]/5 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.productName}`}
                        onClick={() =>
                          updateCartQuantity(item.productId, item.format, 1)
                        }
                        className="p-1.5 text-[#2A1408] hover:bg-[#2A1408]/5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-display font-bold text-sm text-[#2A1408] tabular-nums">
                      {formatINR(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer totals */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#2A1408]/10 bg-[#FFF7EA]/60 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#2A1408]/80">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium">
                  {formatINR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[#2A1408]/80">
                <span>Delivery Fee</span>
                <span className="tabular-nums font-medium">
                  {deliveryFee === 0 ? (
                    <span className="text-[#1E7A46] font-semibold">FREE</span>
                  ) : (
                    formatINR(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#2A1408] pt-2 border-t border-[#2A1408]/10">
                <span>Total</span>
                <span className="font-display text-lg text-[#A41220] tabular-nums">
                  {formatINR(total)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="w-full py-3 px-6 rounded-xl bg-[#A41220] text-[#FFFDF7] font-medium text-sm hover:bg-[#6E0B16] transition-colors cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
