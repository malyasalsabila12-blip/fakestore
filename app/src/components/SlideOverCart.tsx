import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface SlideOverCartProps {
  isOpen: boolean;
  cart: Product[];
  onClose: () => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}

const SlideOverCart: React.FC<SlideOverCartProps> = ({ isOpen, cart, onClose, removeFromCart, clearCart }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col transition-all duration-300 ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'} bg-white text-black shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Your bag</p>
            <h2 className="text-lg font-black uppercase tracking-widest">{cart.length} item{cart.length === 1 ? '' : 's'}</h2>
          </div>
          <button onClick={onClose} className="p-2 transition hover:opacity-50" aria-label="Close cart">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center border border-dashed border-zinc-200 p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="mt-4 text-xs font-black uppercase tracking-widest text-black">Your bag is empty</h3>
              <p className="mt-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">Add a few favorites to see them here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center gap-4 border border-zinc-100 p-4 bg-white">
                  <img src={item.image} alt={item.title} className="h-16 w-16 object-contain mix-blend-multiply bg-white p-2" />
                  <div className="min-w-0 flex-1 text-black">
                    <p className="truncate text-xs font-black uppercase tracking-tight">{item.title}</p>
                    <p className="mt-1 text-xs font-black">IDR {Math.round(item.price * 15000).toLocaleString()}</p>
                  </div>
                  <button onClick={() => removeFromCart(index)} className="p-2 hover:text-red-600 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`border-t border-zinc-200 px-6 py-8 bg-zinc-50`}>
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-black">
            <span className="text-zinc-500">Subtotal</span>
            <span className="text-base font-black">IDR {Math.round(subtotal * 15000).toLocaleString()}</span>
          </div>
          <div className="mt-8 flex gap-3">
            <button onClick={clearCart} className="flex-1 border border-black px-4 py-4 text-[10px] font-black uppercase tracking-widest transition hover:bg-zinc-100">
              Clear
            </button>
            <Link 
              to="/cart" 
              onClick={onClose} 
              className="flex-2 bg-black text-white px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest transition hover:bg-zinc-800"
              data-test="slideover-checkout"
            >
              Checkout — IDR {Math.round(subtotal * 15000).toLocaleString()}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SlideOverCart;
