import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Product } from '../types';
import { getProductImage, getFallbackImage } from '../utils';

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
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const url = `https://fakestoreapi.com/products/${id}`;
      setLoading(true);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Not Found');
        const data = await res.json();
        setProduct(data);
        
        // Fetch related products
        const relatedRes = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(data.category)}`);
        const relatedData = await relatedRes.json();
        setRelatedProducts(relatedData.filter((p: Product) => p.id !== data.id).slice(0, 4));
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Could not find the product you are looking for.');
        setLoading(false);
      }
    };
    fetchProduct();
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
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-6 h-4 w-32 animate-pulse bg-zinc-100 rounded"></div>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-square animate-pulse bg-zinc-100 rounded-3xl"></div>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <div className="h-4 w-24 animate-pulse bg-zinc-100 rounded"></div>
              <div className="h-10 w-full animate-pulse bg-zinc-100 rounded-lg"></div>
              <div className="h-6 w-32 animate-pulse bg-zinc-100 rounded"></div>
            </div>
            <div className="h-12 w-48 animate-pulse bg-zinc-100 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse bg-zinc-100 rounded"></div>
              <div className="h-4 w-full animate-pulse bg-zinc-100 rounded"></div>
              <div className="h-4 w-2/3 animate-pulse bg-zinc-100 rounded"></div>
            </div>
            <div className="flex gap-4 pt-8">
              <div className="h-14 w-32 animate-pulse bg-zinc-100 rounded-full"></div>
              <div className="h-14 flex-1 animate-pulse bg-zinc-100 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto mt-20 max-w-3xl px-4 text-center" data-test="error-state">
        <p className="mb-8 text-xl font-black uppercase text-zinc-900">{error || 'Product not found'}</p>
        <Link to="/" className="rounded-full bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest transition hover:bg-zinc-800">Back to Collection</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <nav className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span className="material-icons text-[10px]">chevron_right</span>
        <span className="text-black">{product.category}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:items-start" data-test="product-details-container">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-zinc-50 p-12 transition-all duration-500 hover:shadow-2xl group">
          <img 
            src={getProductImage(product.image, product.category)} 
            alt={product.title} 
            className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105" 
            data-test="detail-image" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = getFallbackImage(product.category);
            }}
          />
          <button
            onClick={() => { toggleFavorite(product); setHeartPop(true); setTimeout(() => setHeartPop(false), 260); }}
            className={`absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-full border bg-white/80 backdrop-blur-md transition-all duration-300 ${favorites.includes(product.id) ? 'border-red-100 text-red-600 shadow-lg shadow-red-200/50' : 'border-zinc-100 text-zinc-400 hover:border-black hover:text-black shadow-sm'} ${heartPop ? 'scale-110' : ''}`}
            data-test="detail-favorite-btn"
          >
            <span className="material-icons">{favorites.includes(product.id) ? 'favorite' : 'favorite_border'}</span>
          </button>
        </div>

        {/* Product Info */}
        <div className="flex flex-col py-2">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400" data-test="detail-category">{product.category}</p>
          <h1 className="mt-4 text-4xl font-black uppercase leading-tight tracking-tight md:text-5xl" data-test="detail-title">{product.title}</h1>

          <div className="mt-6 flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <span className="material-icons text-yellow-500 text-xl">star</span>
              <span className="text-sm font-black text-black">{product.rating?.rate}</span>
              <span className="text-xs font-medium text-zinc-400">({product.rating?.count} reviews)</span>
            </div>
            <div className="h-4 w-px bg-zinc-200"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">ID: FS-{product.id}</p>
          </div>

          <div className="mt-10">
            <p className="text-5xl font-black text-black tracking-tighter">IDR {Math.round(product.price * 15000).toLocaleString()}</p>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400">Includes taxes & worldwide shipping</p>
          </div>

          <div className="mt-10 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Product description</h3>
            <p className="text-sm leading-relaxed text-zinc-600" data-test="detail-description">{product.description}</p>
          </div>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 items-center rounded-full bg-zinc-100 px-2 py-2">
              <button
                onClick={() => removeOneFromCart(product)}
                disabled={productQuantity === 0}
                className="flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-zinc-400 transition-colors hover:bg-white hover:text-black disabled:opacity-20"
                data-test="decrement-product-btn"
              >
                −
              </button>
              <span className="flex w-12 items-center justify-center text-sm font-black" data-test="qty-count">{productQuantity}</span>
              <button
                onClick={() => addToCart(product)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-bold text-black shadow-sm transition-transform active:scale-95"
                data-test="increment-detail-btn"
              >
                +
              </button>
            </div>
            <button
                onClick={() => addToCart(product)}
                className="group relative flex flex-1 items-center justify-center gap-3 overflow-hidden rounded-full bg-black px-10 h-16 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-zinc-800 hover:shadow-2xl active:scale-[0.98]"
            >
                <span className="material-icons text-xl">shopping_bag</span>
                Add to Bag
                {productQuantity > 0 && (
                  <span className="ml-2 rounded-full bg-white/20 px-3 py-1 text-[10px]">{productQuantity}</span>
                )}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-zinc-100 pt-10">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 text-zinc-900">
                <span className="material-icons text-xl">local_shipping</span>
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Free Express Shipping</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 text-zinc-900">
                <span className="material-icons text-xl">verified</span>
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Authentic Guaranteed</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 text-zinc-900">
                <span className="material-icons text-xl">history</span>
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">30-Day Free Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-32 border-t border-zinc-100 pt-24">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Curated For You</p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-tight">Complete the look</h2>
            </div>
            <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-black underline underline-offset-8 transition-opacity hover:opacity-70">
              View All Collection
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map(relProduct => (
              <div key={relProduct.id} className="group cursor-pointer">
                <Link to={`/product/${relProduct.id}`}>
                  <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-zinc-50 p-8 transition-all duration-500 group-hover:shadow-xl">
                    <img 
                      src={relProduct.image} 
                      alt={relProduct.title} 
                      className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                  <div className="mt-6">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{relProduct.category}</p>
                    <h3 className="mt-2 text-sm font-bold leading-snug text-black line-clamp-1 group-hover:underline">{relProduct.title}</h3>
                    <p className="mt-3 text-sm font-black">IDR {Math.round(relProduct.price * 15000).toLocaleString()}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
