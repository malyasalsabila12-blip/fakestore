import React, { useState, useEffect, useRef } from 'react';
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
  isDarkMode: boolean;
}

const Home: React.FC<HomeProps> = ({ addToCart, removeOneFromCart, cart, favorites, toggleFavorite, isDarkMode }) => {
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

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <header className="mb-10 p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="max-w-2xl">
            <p className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] ${isDarkMode ? 'text-pink-100 bg-rose-900/20' : 'text-[#b45309] bg-[#fef2f2]'}`}>New season picks</p>
            <h1 className={`mt-4 text-4xl font-semibold tracking-tight md:text-5xl ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`} data-test="home-title">
              Curated essentials for everyday style.
            </h1>
            <p className={`mt-4 text-lg ${isDarkMode ? 'text-slate-200' : 'text-[#334155]'}`}>Discover modern favorites with a minimal aesthetic and fast checkout.</p>
          </div>

          <div className="w-full rounded-[24px] border p-4 shadow-sm">
            <div className="relative">
              <button
                onClick={focusSearch}
                aria-label="Focus search"
                className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full flex items-center justify-center z-10 ${isDarkMode ? 'bg-transparent text-white ring-0' : 'bg-white text-[#0f172a] ring-1 ring-[#e6eef6] shadow-lg'}`}
              >
                <span className="material-icons">search</span>
              </button>
              <input
                type="text"
                className={`w-full rounded-lg bg-transparent pl-16 pr-12 py-3 ${isDarkMode ? 'text-white placeholder:text-slate-300' : 'text-[#0f172a] placeholder:text-[#9ca3af]'} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#e53935]`}
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-test="search-input"
                aria-label="Search products"
              />
              <button
                onClick={startVoiceSearch}
                className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-3 z-10 ${isListening ? 'bg-[#e53935] text-white shadow-sm' : (isDarkMode ? 'bg-transparent text-white ring-0 hover:bg-white/10' : 'bg-white text-[#0f172a] border border-[#e6eef6] shadow-sm')}`}
                title="Voice Search"
              >
                <span className="material-icons text-base">{isListening ? 'mic' : 'mic_none'}</span>
              </button>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap gap-2" data-test="category-filters">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition ${selectedCategory === 'all' ? 'bg-[#e53935] text-white' : `${isDarkMode ? 'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10' : 'bg-white text-[#334155] hover:bg-[#e2e8f0]'}`}`}
                  data-test="category-all"
                >
                  All
                </button>
                {categories.filter(c => c.toLowerCase() !== "women's clothing").map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition ${selectedCategory === cat ? 'bg-[#e53935] text-white' : `${isDarkMode ? 'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10' : 'bg-white text-[#334155] hover:bg-[#e2e8f0]'}`}`}
                    data-test={`category-${cat.replace(/\s+/g, '-')}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Place Women's Clothing button on its own row under the search controls */}
              {categories.find(c => c.toLowerCase() === "women's clothing") && (
                <div className="mt-4">
                  <button
                    onClick={() => setSelectedCategory("women's clothing")}
                    className={`w-full sm:w-auto rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] transition ${selectedCategory === "women's clothing" ? 'bg-[#e53935] text-white' : `${isDarkMode ? 'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10' : 'bg-white text-[#334155] hover:bg-[#e2e8f0]'}`}`}
                    data-test="category-womens-clothing"
                  >
                    Women's Clothing
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]" data-test="loading">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Updating collection...</p>
        </div>
      ) : error ? (
        <div className="text-center mt-20 text-red-600 p-4" data-test="error-state">
          <p className="text-xl font-bold">{error}</p>
          <button onClick={() => setSelectedCategory('all')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Reset Filters</button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm transition-colors" data-test="empty-state">
          <span className="material-icons text-6xl text-gray-200 dark:text-gray-700 mb-4">search_off</span>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your criteria.</p>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="mt-4 text-blue-600 dark:text-blue-400 font-bold hover:underline">Clear all filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-test="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="transition-all duration-300">
              <ProductCard product={product} addToCart={addToCart} removeOneFromCart={removeOneFromCart} cart={cart} favorites={favorites} toggleFavorite={toggleFavorite} isDarkMode={isDarkMode} />
            </div>
          ))}
        </div>
      )}

      <footer className="mt-12 rounded-[32px] border border-[#f2e8e8] bg-white/80 px-6 py-6 text-center text-sm text-[#6b7280] shadow-sm">
        <p>Minimal essentials • Fast delivery • Thoughtful design</p>
      </footer>

      <MysteryBox isDarkMode={isDarkMode} />
    </div>
  );
};

export default Home;
