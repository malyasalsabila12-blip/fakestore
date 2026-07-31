import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { getFallbackImage } from '../utils';

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
      className={`flex h-full flex-col overflow-hidden border p-4 transition-all duration-300 hover:shadow-xl border-zinc-200 bg-white text-black`} 
      data-test={`product-card-${product.id}`}
      draggable
      onDragStart={handleDragStart}
    >
      <button
        onClick={() => { toggleFavorite(product); setHeartPop(true); setTimeout(() => setHeartPop(false), 260); }}
        className={`absolute top-3 right-3 z-20 p-2 bg-white/90 border border-zinc-200 focus:outline-none heart-pop ${heartPop ? 'pop' : ''}`}
        aria-label="Toggle favorite"
        data-test="card-favorite-btn"
      >
        <span className="material-icons text-base">{favorites.includes(product.id) ? 'favorite' : 'favorite_border'}</span>
      </button>
      <div className={`mb-4 flex items-center justify-center p-4 bg-white`}>
        <Link to={`/product/${product.id}`} className="w-full flex items-center justify-center" data-test="product-link">
          <img 
            src={`https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto,w_400/${product.image}`} 
            alt={product.title} 
            className="h-48 w-full object-contain mix-blend-multiply" 
            data-test="product-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getFallbackImage(product.category);
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
      <div className="mt-4 flex flex-col gap-3">
        <p className="text-base font-black" data-test="product-price">IDR {Math.round(product.price * 15000).toLocaleString()}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest transition hover:bg-zinc-800 focus:outline-none"
            data-test="increment-product-btn"
          >
            Add to Bag
          </button>
          {productQuantity > 0 && (
            <span className="flex h-8 w-8 items-center justify-center border border-black text-xs font-bold">{productQuantity}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
