import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Product } from '../types';

interface ProductDetailsProps {
  addToCart: (product: Product) => void;
  removeOneFromCart: (product: Product) => void;
  cart: Product[];
  favorites: number[];
  toggleFavorite: (product: Product) => void;
  isDarkMode: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ addToCart, removeOneFromCart, cart, favorites, toggleFavorite, isDarkMode }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = `https://fakestoreapi.com/products/${id}`;
    console.log('Fetching product from:', url);
    setLoading(true);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Not Found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Could not find the product you are looking for.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center" data-test="loading">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#e53935]"></div>
        <p className="text-[#6b7280]">Loading product details...</p>
      </div>
    );
  }

  const productQuantity = product ? cart.filter(item => item.id === product.id).length : 0;

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

  if (error || !product) {
    return (
      <div className="mx-auto mt-20 max-w-3xl px-4 text-center" data-test="error-state">
        <p className="mb-4 text-xl font-semibold text-[#c62828]">{error || 'Product not found'}</p>
        <Link to="/" className="rounded-full bg-[#e53935] px-6 py-3 text-white transition hover:bg-[#c62828]">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 md:px-8 md:py-8">
      <Link to="/" className={`mb-6 inline-flex items-center text-sm font-semibold transition ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-[#6b7280] hover:text-[#111111]'}`} data-test="back-link">
        <span className="material-icons mr-2 text-base">arrow_back</span>
        Return to collection
      </Link>

      <div className={`grid gap-8 rounded-[36px] p-6 md:p-10 lg:grid-cols-[1.1fr_0.9fr] shadow-sm ${isDarkMode ? 'border border-[#35131f] bg-[#231018]' : 'border border-[#f2e8e8] bg-white'}`} data-test="product-details-container">
        <div className={`flex items-center justify-center rounded-[28px] p-8 ${isDarkMode ? 'bg-[#2f1922]' : 'bg-[#fcf8f8]'}`}>
          <img src={product.image} alt={product.title} className="h-[420px] w-full object-contain transition duration-500 hover:scale-105" data-test="detail-image" />
        </div>

        <div className="flex flex-col justify-center">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.35em] ${isDarkMode ? 'text-pink-200' : 'text-[#b45309]'}`} data-test="detail-category">{product.category}</p>
          <h1 className={`mt-3 text-3xl font-semibold tracking-tight md:text-4xl ${isDarkMode ? 'text-white' : 'text-[#111111]'}`} data-test="detail-title">{product.title}</h1>

          <div className="mt-5 flex items-center gap-3">
            <div className={`flex items-center rounded-full px-3 py-2 text-sm font-semibold ${isDarkMode ? 'bg-white/5 text-white' : 'bg-[#fff7ed] text-[#f59e0b]'}`}>
              <span className="material-icons mr-1 text-base">star</span>
              {product.rating?.rate}
            </div>
            <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-[#6b7280]'}`}>{product.rating?.count} verified reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <p className="text-4xl font-semibold text-[#e53935]" data-test="detail-price">${product.price}</p>
            <p className={`text-lg line-through ${isDarkMode ? 'text-slate-400' : 'text-[#9ca3af]'}`}>${(product.price * 1.2).toFixed(2)}</p>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4" data-test="detail-info-grid">
            <div className={`rounded-[12px] p-3 ${isDarkMode ? 'bg-white/5 text-white' : 'bg-[#fff7ed] text-[#6b7280]'}`}>
              <p className="text-xs">Product ID</p>
              <p className="font-semibold">{product.id}</p>
            </div>
            <div className={`rounded-[12px] p-3 ${isDarkMode ? 'bg-white/5 text-white' : 'bg-[#f8fafc] text-[#111111]'}`}>
              <p className="text-xs">Selected quantity</p>
              <p className="font-semibold">{productQuantity}</p>
            </div>
            <div className={`rounded-[12px] p-3 ${isDarkMode ? 'bg-white/5 text-white' : 'bg-[#fff7ed] text-[#6b7280]'}`}>
              <p className="text-xs">Subtotal</p>
              <p className="font-semibold">${(productQuantity * product.price).toFixed(2)}</p>
            </div>
          </div>

          <div className={`mt-6 rounded-[24px] p-5 ${isDarkMode ? 'border border-[#35131f] bg-[#231018]' : 'border border-[#f2e8e8] bg-[#fcf8f8]'}`}>
            <h3 className={`text-[11px] font-semibold uppercase tracking-[0.35em] ${isDarkMode ? 'text-[#fda4af]' : 'text-[#b45309]'}`}>Product overview</h3>
            <p className={`mt-3 leading-7 ${isDarkMode ? 'text-[#f3e7e7]' : 'text-[#4b5563]'}`} data-test="detail-description">{product.description}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => removeOneFromCart(product)}
                disabled={productQuantity === 0}
                className={`rounded-full px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/10 text-black hover:bg-white/20'}`}
                data-test="decrement-detail-btn"
              >
                −
              </button>
              <span className={`min-w-[3rem] h-10 flex items-center justify-center rounded-full px-4 text-sm font-semibold badge-anim ${isDarkMode ? 'bg-white/10 text-white border border-white/20' : 'bg-[#f8fafc] text-[#111111] border border-[#e6eef6]'} ${badgePop ? 'pop' : ''}`}>{productQuantity}</span>
              <button
                onClick={() => addToCart(product)}
                className="rounded-full bg-[#e53935] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c62828]"
                data-test="increment-detail-btn"
              >
                +
              </button>
            </div>
            <button
              onClick={() => { toggleFavorite(product); setHeartPop(true); setTimeout(() => setHeartPop(false), 260); }}
              className={`rounded-full px-4 py-3 transition heart-pop ${heartPop ? 'pop' : ''} ${favorites.includes(product.id) ? (isDarkMode ? 'bg-[#3b0d12] text-[#fda4af] border border-[#4b1a1f]' : 'bg-[#ffe4e6] text-[#c62828] border border-[#fecaca]') : (isDarkMode ? 'border border-[#35131f] text-white hover:bg-white/10' : 'border border-[#f2e8e8] text-[#6b7280] hover:bg-[#fcf8f8]')}`}
              data-test="detail-favorite-btn"
            >
              <span className="material-icons">{favorites.includes(product.id) ? 'favorite' : 'favorite_border'}</span>
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[20px] bg-[#fff7ed] p-4 text-center text-sm text-[#6b7280]">
              <span className="material-icons mb-2 text-[#e53935]">local_shipping</span>
              <p className="font-semibold text-[#111111]">Fast delivery</p>
            </div>
            <div className="rounded-[20px] bg-[#fff7ed] p-4 text-center text-sm text-[#6b7280]">
              <span className="material-icons mb-2 text-[#e53935]">verified</span>
              <p className="font-semibold text-[#111111]">Authentic</p>
            </div>
            <div className="rounded-[20px] bg-[#fff7ed] p-4 text-center text-sm text-[#6b7280]">
              <span className="material-icons mb-2 text-[#e53935]">history</span>
              <p className="font-semibold text-[#111111]">Easy returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
