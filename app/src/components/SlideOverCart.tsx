import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { getProductImage, getFallbackImage } from '../utils';

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
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center border border-dashed border-zinc-200 p-8 text-center">
              <span className="material-icons text-5xl text-zinc-200">shopping_basket</span>
              <h3 className="mt-4 text-xs font-black uppercase tracking-widest text-black">Your bag is empty</h3>
              <p className="mt-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">Add a few favorites to see them here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center gap-4 border border-zinc-100 p-4 bg-white">
                  <img 
                    src={getProductImage(item.image, item.category, item.id, item.title)} 
                    alt={item.title} 
                    className="h-16 w-16 object-contain bg-white p-2" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getFallbackImage(item.category, item.id, item.title);
                    }}
                  />
                  <div className="min-w-0 flex-1 text-black">
                    <p className="truncate text-xs font-black uppercase tracking-tight">{item.title}</p>
                    <p className="mt-1 text-xs font-black">IDR {Math.round(item.price * 15000).toLocaleString()}</p>
                  </div>
                  <button onClick={() => removeFromCart(index)} className="p-2 hover:text-red-600 transition">
                    <span className="material-icons text-base">delete_outline</span>
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
              className="flex-1 bg-black text-white px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest transition hover:bg-zinc-800"
              data-test="slideover-checkout"
            >
              Go to Bag
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SlideOverCart;
