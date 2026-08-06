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
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart, removeOneFromCart, cart, favorites, toggleFavorite }) => {
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
      className={`relative flex h-full flex-col overflow-hidden border p-4 transition-all duration-300 hover:shadow-xl border-zinc-200 bg-white text-black`} 
      data-test={`product-card-${product.id}`}
      draggable
      onDragStart={handleDragStart}
    >
      <button
        onClick={() => { toggleFavorite(product); setHeartPop(true); setTimeout(() => setHeartPop(false), 260); }}
        className={`absolute top-3 right-3 z-20 focus:outline-none heart-pop ${heartPop ? 'pop' : ''}`}
        aria-label="Toggle favorite"
        data-test="card-favorite-btn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${favorites.includes(product.id) ? 'fill-red-600 stroke-red-600' : 'stroke-black'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      <div className={`mb-4 flex items-center justify-center p-4 bg-white`}>
        <Link to={`/product/${product.id}`} className="w-full flex items-center justify-center" data-test="product-link">
          <img 
            src={product.image} 
            alt={product.title} 
            className="h-48 w-full object-contain mix-blend-multiply" 
            data-test="product-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Image+Not+Found';
            }}
          />
        </Link>
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500" data-test="product-category">{product.category}</p>
        <h2 className="mt-2 text-sm font-bold leading-tight" title={product.title} data-test="product-title">
          <Link to={`/product/${product.id}`} className="hover:underline line-clamp-2">{product.title}</Link>
        </h2>
        <div className="mt-3 flex items-center gap-1 text-[10px] text-zinc-400">
          {'★★★★★'.split('').slice(0, 5).join('')}
          <span className="ml-1">(120)</span>
        </div>
      </div>
      <div className="mt-auto pt-6 flex flex-col gap-4">
        <p className="text-lg font-black text-black" data-test="product-price">IDR {Math.round(product.price * 15000).toLocaleString()}</p>
        <div className="flex items-center gap-2">
          {productQuantity === 0 ? (
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-black text-white px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-zinc-800 focus:outline-none rounded-full shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98]"
              data-test="add-to-cart-btn"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex flex-1 h-11 items-center justify-between bg-zinc-100 rounded-full px-6 border border-transparent">
              <button
                onClick={() => removeOneFromCart(product)}
                className="text-xl font-light text-zinc-400 hover:text-black transition-colors"
                data-test="decrement-product-btn"
                aria-label="Remove one"
              >
                −
              </button>
              <span className="text-sm font-black text-black" data-test="product-quantity">{productQuantity}</span>
              <button
                onClick={() => addToCart(product)}
                className="text-xl font-light text-black hover:opacity-70 transition-opacity"
                data-test="increment-product-btn"
                aria-label="Add one"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
