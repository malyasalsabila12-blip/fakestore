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
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ addToCart, removeOneFromCart, cart, favorites, toggleFavorite }) => {
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center" data-test="loading">
        <div className="mb-4 h-8 w-8 animate-spin border-t-2 border-black"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Loading details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto mt-20 max-w-3xl px-4 text-center" data-test="error-state">
        <p className="mb-8 text-xl font-black uppercase">{error || 'Product not found'}</p>
        <Link to="/" className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest transition hover:bg-zinc-800">Back to Collection</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 md:px-8 md:py-8">
      <Link to="/" className={`mb-6 inline-flex items-center text-[10px] font-black uppercase tracking-widest transition text-zinc-500 hover:text-black`} data-test="back-link">
        <span className="material-icons mr-2 text-base">arrow_back</span>
        Return to collection
      </Link>

      <div className={`grid gap-8 p-0 lg:grid-cols-[1.1fr_0.9fr] border border-black bg-white`} data-test="product-details-container">
        <div className={`flex items-center justify-center p-8 bg-white`}>
          <img src={product.image} alt={product.title} className="h-[420px] w-full object-contain mix-blend-multiply" data-test="detail-image" />
        </div>

        <div className="flex flex-col justify-center p-8 md:p-12 text-black">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500" data-test="detail-category">{product.category}</p>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-tight md:text-4xl" data-test="detail-title">{product.title}</h1>

          <div className="mt-5 flex items-center gap-3">
            <div className={`flex items-center px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-zinc-200 text-black`}>
              <span className="material-icons mr-1 text-base">star</span>
              {product.rating?.rate}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{product.rating?.count} reviews</span>
          </div>

          <div className="mt-8 flex flex-col gap-6">
            <p className="text-4xl font-black" data-test="detail-price">IDR {Math.round(product.price * 15000).toLocaleString()}</p>
            <p className={`text-lg line-through text-slate-400`}>${(product.price * 1.2).toFixed(2)}</p>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4" data-test="detail-info-grid">
            <div className={`rounded-[12px] p-3 bg-slate-100 text-slate-600`}>
              <p className="text-xs">Product ID</p>
              <p className="font-semibold">{product.id}</p>
            </div>
            <div className={`rounded-[12px] p-3 bg-slate-50 text-slate-900`}>
              <p className="text-xs">Selected quantity</p>
              <p className="font-semibold">{productQuantity}</p>
            </div>
            <div className={`rounded-[12px] p-3 bg-slate-100 text-slate-600`}>
              <p className="text-xs">Subtotal</p>
              <p className="font-semibold">${(productQuantity * product.price).toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] p-5 border border-slate-200 bg-slate-50">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-600">Product overview</h3>
            <p className="mt-3 leading-7 text-slate-600" data-test="detail-description">{product.description}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => removeOneFromCart(product)}
                disabled={productQuantity === 0}
                className="rounded-full px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 bg-slate-100 text-slate-900 hover:bg-slate-200"
                data-test="decrement-product-btn"
              >
                −
              </button>
              <span className={`min-w-[3rem] h-10 flex items-center justify-center rounded-full px-4 text-sm font-semibold badge-anim bg-slate-50 text-slate-900 border border-slate-200 ${badgePop ? 'pop' : ''}`}>{productQuantity}</span>
              <button
                onClick={() => addToCart(product)}
                className="rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                data-test="increment-detail-btn"
              >
                +
              </button>
            </div>
            <button
              onClick={() => { toggleFavorite(product); setHeartPop(true); setTimeout(() => setHeartPop(false), 260); }}
              className={`rounded-full px-4 py-3 transition heart-pop ${heartPop ? 'pop' : ''} ${favorites.includes(product.id) ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
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
