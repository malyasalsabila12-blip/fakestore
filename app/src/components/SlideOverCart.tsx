import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface SlideOverCartProps {
  isOpen: boolean;
  cart: Product[];
  onClose: () => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  isDarkMode: boolean;
}

const SlideOverCart: React.FC<SlideOverCartProps> = ({ isOpen, cart, onClose, removeFromCart, clearCart, isDarkMode }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${isDarkMode ? 'border-l border-[#35131f] bg-[#231018] shadow-2xl' : 'border-l border-[#f2e8e8] bg-[#fffdfd] shadow-2xl'}`}
      >
        <div className="flex items-center justify-between border-b border-[#f2e8e8] px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b45309]">Your cart</p>
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>{cart.length} item{cart.length === 1 ? '' : 's'}</h2>
          </div>
          <button onClick={onClose} className={`${isDarkMode ? 'rounded-full p-2 text-slate-300 transition hover:bg-white/5 hover:text-white' : 'rounded-full p-2 text-[#475569] transition hover:bg-[#e2e8f0] hover:text-[#111111]'}`} aria-label="Close cart">
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <div className={`${isDarkMode ? 'flex h-full flex-col items-center justify-center rounded-[24px] border border-dashed border-[#3b0d12] bg-[#231018] p-8 text-center' : 'flex h-full flex-col items-center justify-center rounded-[24px] border border-dashed border-[#e7d9d9] bg-[#fcf8f8] p-8 text-center'}`}>
              <span className="material-icons text-5xl text-[#d97706]">shopping_basket</span>
              <h3 className={`mt-4 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>Your bag is empty</h3>
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-[#6b7280]'}`}>Add a few favorites to see them here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className={`${isDarkMode ? 'flex items-center gap-3 rounded-[20px] border border-[#35131f] bg-[#231018] p-3 shadow-sm' : 'flex items-center gap-3 rounded-[20px] border border-[#f2e8e8] bg-white p-3 shadow-sm'}`}>
                  <img src={item.image} alt={item.title} className="h-16 w-16 rounded-[16px] object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>{item.title}</p>
                    <p className="mt-1 text-sm font-semibold text-[#e53935]">${item.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => removeFromCart(index)} className={`${isDarkMode ? 'rounded-full p-2 text-slate-300 transition hover:bg-white/5 hover:text-[#e53935]' : 'rounded-full p-2 text-[#475569] transition hover:bg-[#e2e8f0] hover:text-[#e53935]'}`} aria-label={`Remove ${item.title}`}>
                    <span className="material-icons text-base">delete_outline</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`${isDarkMode ? 'border-t border-[#35131f] bg-[#231018] px-6 py-5' : 'border-t border-[#f2e8e8] bg-[#fcf8f8] px-6 py-5'}`}>
          <div className={`flex items-center justify-between text-sm ${isDarkMode ? 'text-slate-300' : 'text-[#6b7280]'}`}>
            <span>Subtotal</span>
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>${subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={clearCart} className={`${isDarkMode ? 'flex-1 rounded-full border border-[#35131f] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5' : 'flex-1 rounded-full border border-[#e7d9d9] px-4 py-3 text-sm font-semibold text-[#6b7280] transition hover:bg-[#f9f2f2]'}`}>
              Clear
            </button>
            <Link 
              to="/cart" 
              onClick={onClose} 
              className="flex-1 rounded-full bg-[#e53935] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#c62828]"
              data-test="slideover-checkout"
            >
              Checkout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SlideOverCart;
