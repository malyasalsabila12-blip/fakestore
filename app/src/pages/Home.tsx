import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import VisualSearch from '../components/VisualSearch';
import MysteryBox from '../components/MysteryBox';
import { Product } from '../types';

interface HomeProps {
  addToCart: (product: Product) => void;
  isDarkMode: boolean;
}

const Home: React.FC<HomeProps> = ({ addToCart, isDarkMode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [visualSearchResults, setVisualSearchResults] = useState<Product[] | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
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
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();
    let result = products;
    
    if (query) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(result);
  }, [debouncedSearchQuery, products]);

  const startVoiceSearch = () => {
    setIsListening(true);
    // Simulated voice recognition
    setTimeout(() => {
      const demoQueries = ['electronics', 'jewelery', 'men\'s clothing'];
      const randomQuery = demoQueries[Math.floor(Math.random() * demoQueries.length)];
      setSearchQuery(randomQuery);
      setIsListening(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <header className="mb-16 text-center">
        <div className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 animate-float ${isDarkMode ? 'bg-pink-900/20 text-pink-400' : 'bg-pink-50 text-pink-600'}`}>
          BIG SUMMER SALE 2026
        </div>
        <h1 className={`text-5xl md:text-7xl font-black mb-6 transition-all duration-700 tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-rose-950'}`} data-test="home-title">
          SHOP THE BEST <br /> 
          <span className="text-gradient">DEALS TODAY</span>
        </h1>
        <p className={`mb-12 max-w-xl mx-auto font-medium text-lg leading-relaxed transition-all duration-700 ${isDarkMode ? 'text-pink-200/60' : 'text-pink-900/60'}`}>
          Explore thousands of premium products at unbeatable prices. Everything you need, just a click away.
        </p>
        
        <div className={`max-w-3xl mx-auto space-y-8 backdrop-blur-md p-8 rounded-3xl border shadow-2xl transition-all duration-700 ${isDarkMode ? 'bg-rose-950/30 border-pink-500/10' : 'bg-white/30 border-pink-100'}`}>
          <div className="relative group">
            <span className={`material-icons absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-pink-700 group-focus-within:text-pink-400' : 'text-pink-200 group-focus-within:text-pink-600'}`}>search</span>
            <input
              type="text"
              placeholder="Search products..."
              className={`w-full pl-12 pr-14 py-4 rounded-2xl border-0 outline-none transition-all shadow-inner text-lg font-medium ${isDarkMode ? 'bg-rose-950 text-white focus:ring-2 focus:ring-pink-500' : 'bg-white text-rose-950 focus:ring-2 focus:ring-pink-600'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-test="search-input"
            />
            <button 
              onClick={startVoiceSearch}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'bg-pink-500 text-white animate-pulse' : isDarkMode ? 'text-pink-400 hover:text-white hover:bg-rose-900' : 'text-pink-300 hover:text-pink-600 hover:bg-pink-50'}`}
              title="Voice Search"
            >
              <span className="material-icons text-2xl">{isListening ? 'mic' : 'mic_none'}</span>
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3" data-test="category-filters">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg ${selectedCategory === 'all' ? (isDarkMode ? 'bg-pink-600 text-white shadow-pink-900/40' : 'bg-pink-600 text-white shadow-pink-200') : (isDarkMode ? 'bg-rose-900 text-pink-300 hover:bg-rose-800 border border-pink-500/10' : 'bg-white text-pink-600 hover:bg-pink-50 border border-pink-100')}`}
              data-test="category-all"
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg ${selectedCategory === cat ? (isDarkMode ? 'bg-pink-600 text-white shadow-pink-900/40' : 'bg-pink-600 text-white shadow-pink-200') : (isDarkMode ? 'bg-rose-900 text-pink-300 hover:bg-rose-800 border border-pink-500/10' : 'bg-white text-pink-600 hover:bg-pink-50 border border-pink-100')}`}
                data-test={`category-${cat.replace(/\s+/g, '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <VisualSearch 
            allProducts={products} 
            onSearch={(results) => setVisualSearchResults(results)} 
            isDarkMode={isDarkMode}
          />
        </div>
      </header>

      {visualSearchResults && (
        <div className={`mb-8 p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500 ${isDarkMode ? 'bg-pink-900/10 border-pink-500/20 text-pink-100' : 'bg-pink-50 border-pink-100 text-pink-900'}`}>
          <div className="flex items-center mb-4 sm:mb-0">
            <span className={`material-icons mr-3 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>auto_awesome</span>
            <h2 className="text-xl font-bold">AI Visual Search Results</h2>
          </div>
          <button 
            onClick={() => setVisualSearchResults(null)}
            className={`font-bold hover:underline flex items-center ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}
          >
            <span className="material-icons text-sm mr-1">close</span>
            Clear Results
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]" data-test="loading">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Updating collection...</p>
        </div>
      ) : error ? (
        <div className="text-center mt-20 text-red-600 p-4" data-test="error-state">
          <p className="text-xl font-bold">{error}</p>
          <button 
            onClick={() => setSelectedCategory('all')} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm transition-colors" data-test="empty-state">
          <span className="material-icons text-6xl text-gray-200 dark:text-gray-700 mb-4">search_off</span>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your criteria.</p>
          <button 
            onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}
            className="mt-4 text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" data-test="product-grid">
          {(visualSearchResults || filteredProducts).map(product => (
            <div key={product.id} className="transform hover:-translate-y-2 transition-all duration-300">
              <ProductCard product={product} addToCart={addToCart} isDarkMode={isDarkMode} />
            </div>
          ))}
        </div>
      )}

      <MysteryBox isDarkMode={isDarkMode} />
    </div>
  );
};

export default Home;
