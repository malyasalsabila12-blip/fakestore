import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import MysteryBox from '../components/MysteryBox';
import { Product } from '../types';

interface HomeProps {
  addToCart: (product: Product) => void;
  removeOneFromCart: (product: Product) => void;
  cart: Product[];
  favorites: number[];
  toggleFavorite: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ addToCart, removeOneFromCart, cart, favorites, toggleFavorite }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://fakestoreapi.com/products/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = selectedCategory === 'all'
          ? 'https://fakestoreapi.com/products'
          : `https://fakestoreapi.com/products/category/${encodeURIComponent(selectedCategory)}`;
        const res = await axios.get(url);
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();
    let result = products.slice();
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (query) {
      result = result.filter(p => (p.title || '').toLowerCase().includes(query) || (p.description || '').toLowerCase().includes(query));
    }
    setFilteredProducts(result);
  }, [debouncedSearchQuery, products, selectedCategory]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const focusSearch = () => {
    inputRef.current?.focus();
  };

  const startVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      const demoQueries = ['electronics', 'jewelery', "men's clothing"];
      const randomQuery = demoQueries[Math.floor(Math.random() * demoQueries.length)];
      setSearchQuery(randomQuery);
      setIsListening(false);
    }, 2000);
  };

  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      tag: 'Malstro',
      title: 'READY, SET, SHOP!',
      desc: "Don't miss out on special discounts and first-dibs on fresh arrivals, exclusively on the Malstro app.",
      discount: 'UP TO 30% OFF',
      color: 'bg-black'
    },
    {
      tag: 'Malstro',
      title: 'UNMISSABLE APP DEALS!',
      desc: 'Unlock exclusive savings & get early access to new arrivals only on the Malstro app.',
      discount: 'EXTRA 15% OFF',
      color: 'bg-zinc-900'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <header className={`mb-12 overflow-hidden relative min-h-[500px] flex items-center transition-all duration-1000 ${slides[activeSlide].color} text-white`}>
        <div className="mx-auto max-w-7xl w-full flex flex-col md:flex-row h-full">
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-center z-10">
            <p key={`tag-${activeSlide}`} className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-slide-up">
              {slides[activeSlide].tag}
            </p>
            <h1 key={`title-${activeSlide}`} className="mt-4 text-5xl font-black uppercase tracking-tight md:text-8xl animate-slide-up" style={{ animationDelay: '100ms' }}>
              {slides[activeSlide].title}
            </h1>
            <p key={`desc-${activeSlide}`} className="mt-6 text-lg text-zinc-300 max-w-md animate-slide-up" style={{ animationDelay: '200ms' }}>
              {slides[activeSlide].desc}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <button className="bg-white text-black px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition shadow-xl rounded-full">
                Shop the Sale
              </button>
              <div key={`discount-${activeSlide}`} className="discount-tag animate-shimmer px-8 py-4 text-2xl font-black italic tracking-tighter animate-discount-pop flex flex-col items-start leading-none rounded-2xl bg-gradient-to-r from-red-600 to-rose-500">
                <span className="text-[10px] not-italic tracking-[0.2em] opacity-80 mb-1">LIMITED TIME</span>
                {slides[activeSlide].discount}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block flex-1 relative min-h-[400px] overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none">
                <span className="text-[200px] font-black uppercase rotate-90 tracking-widest">MALSTRO</span>
             </div>
             {/* Animated floating elements */}
             <div className="absolute top-1/4 right-1/4 w-32 h-32 border-4 border-white/5 animate-float rounded-full"></div>
             <div className="absolute bottom-1/4 left-1/4 w-48 h-48 border border-white/10 animate-float rounded-full" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-8 md:left-16 flex gap-2">
           {slides.map((_, i) => (
             <div 
               key={i} 
               className={`h-1 transition-all duration-500 rounded-full ${i === activeSlide ? 'w-12 bg-white' : 'w-4 bg-white/20'}`}
             />
           ))}
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition border ${
              selectedCategory === 'all'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-zinc-200 hover:border-black'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition border ${
                selectedCategory === cat
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-zinc-200 hover:border-black'
              }`}
              data-test={`category-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-xs">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search these products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border-b border-black py-2 text-sm outline-none bg-transparent`}
          />
          <span className="material-icons absolute right-0 top-2 text-lg">search</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-test="loading">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-4">
              <div className="aspect-[4/5] w-full animate-pulse bg-zinc-100 rounded-3xl"></div>
              <div className="space-y-2 px-2">
                <div className="h-3 w-20 animate-pulse bg-zinc-100 rounded"></div>
                <div className="h-4 w-full animate-pulse bg-zinc-100 rounded"></div>
                <div className="h-4 w-24 animate-pulse bg-zinc-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center mt-20 text-red-600 p-4" data-test="error-state">
          <p className="text-xl font-bold">{error}</p>
          <button onClick={() => setSelectedCategory('all')} className="mt-4 bg-black text-white px-6 py-2 text-xs font-black uppercase tracking-widest">Retry</button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 border border-zinc-200" data-test="empty-state">
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">No results found.</p>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="mt-4 text-black font-black uppercase tracking-widest text-[10px] hover:underline">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-test="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id}>
              <ProductCard product={product} addToCart={addToCart} removeOneFromCart={removeOneFromCart} cart={cart} favorites={favorites} toggleFavorite={toggleFavorite} />
            </div>
          ))}
        </div>
      )}

      <footer className={`mt-20 border-t py-12 text-center transition-colors duration-300 border-zinc-200 text-zinc-600`}>
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-xl font-black uppercase tracking-[0.3em] text-black">MALSTRO</h2>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <Link to="/" className="hover:text-black">About Us</Link>
            <Link to="/" className="hover:text-black">Shipping</Link>
            <Link to="/" className="hover:text-black">FAQ</Link>
            <Link to="/" className="hover:text-black">Privacy</Link>
          </div>
          <p className="mt-4 text-[9px] uppercase tracking-widest">© 2026 Malstro Asia Pte. Ltd.</p>
        </div>
      </footer>
      <MysteryBox />
      
      {/* WhatsApp Chat Button */}
      <a 
        href="https://wa.me/1234567890" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-32 right-8 z-50 flex items-center gap-3 rounded-full bg-black px-6 py-3 text-white shadow-2xl transition-all hover:scale-105 hover:bg-zinc-800 active:scale-95 group"
      >
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.347-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Chat</span>
        <div className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
        </div>
      </a>
    </div>
    </div>
  );
};

export default Home;
