import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
  removeOneFromCart: (product: Product) => void;
  cart: Product[];
  favorites: number[];
  toggleFavorite: (product: Product) => void;
  isDarkMode: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart, removeOneFromCart, cart, favorites, toggleFavorite, isDarkMode }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('product', JSON.stringify(product));
  };

  const productQuantity = cart.filter(item => item.id === product.id).length;

  const [heartPop, setHeartPop] = useState(false);
  const [badgePop, setBadgePop] = useState(false);
  const prevQtyRef = useRef<number>(productQuantity);

  useEffect(() => {
    if (prevQtyRef.current !== productQuantity) {
      setBadgePop(true);
      const t = setTimeout(() => setBadgePop(false), 180);
      prevQtyRef.current = productQuantity;
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productQuantity]);

  return (
    <div 
      className={`flex h-full flex-col overflow-hidden rounded-[28px] border p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isDarkMode ? 'border-[#35131f] bg-[#231018] text-white' : 'border-[#f2e8e8] bg-white text-[#111111]'}`} 
      data-test={`product-card-${product.id}`}
      draggable
      onDragStart={handleDragStart}
    >
      <button
        onClick={() => { toggleFavorite(product); setHeartPop(true); setTimeout(() => setHeartPop(false), 260); }}
        className={`absolute top-3 right-3 z-20 rounded-full p-2 bg-white/80 dark:bg-white/10 shadow-sm focus:outline-none heart-pop ${heartPop ? 'pop' : ''}`}
        aria-label="Toggle favorite"
        data-test="card-favorite-btn"
      >
        <span className="material-icons text-base">{favorites.includes(product.id) ? 'favorite' : 'favorite_border'}</span>
      </button>
      <div className={`mb-4 flex items-center justify-center rounded-[22px] p-4 ${isDarkMode ? 'bg-[#2f1922]' : 'bg-[#fcf8f8]'}`}>
        <Link to={`/product/${product.id}`} className="w-full flex items-center justify-center" data-test="product-link">
          <img 
            src={product.image} 
            alt={product.title} 
            className="h-40 w-full object-contain transition-transform duration-500 hover:scale-105" 
            data-test="product-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Image+Not+Found';
            }}
          />
        </Link>
      </div>
      <div className="flex-1">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${isDarkMode ? 'text-[#fda4af]' : 'text-[#b45309]'}`} data-test="product-category">{product.category}</p>
        <h2 className={`mt-2 text-base font-semibold leading-6 ${isDarkMode ? 'text-white' : 'text-[#111111]'}`} title={product.title} data-test="product-title">
          <Link to={`/product/${product.id}`} className={`${isDarkMode ? 'text-white' : 'text-[#111111]'} hover:underline`}>{product.title}</Link>
        </h2>
        {/* numeric badge shown between controls below; no duplicate 'Selected' badge here */}
        <div className="mt-3 flex items-center gap-1 text-sm text-[#f59e0b]">
          {'★★★★★'.split('').slice(0, 5).join('')}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg font-semibold text-[#e53935]" data-test="product-price">${product.price}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => removeOneFromCart(product)}
            disabled={productQuantity === 0}
            className={`${isDarkMode ? 'rounded-full bg-white/12 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-white/20' : 'rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-black hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#e53935]'} transition disabled:cursor-not-allowed disabled:opacity-40`}
            data-test="decrement-product-btn"
          >
            −
          </button>
          <span className={`min-w-[2.25rem] h-10 flex items-center justify-center text-sm font-semibold rounded-full badge-anim ${isDarkMode ? 'bg-white/20 text-white border border-white/20' : 'bg-white text-[#111111] border border-[#e6eef6]'} ${badgePop ? 'pop' : ''}`}>{productQuantity}</span>
          <button
            onClick={() => addToCart(product)}
            className="rounded-full bg-[#e53935] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#c62828] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#e53935]"
            data-test="increment-product-btn"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
