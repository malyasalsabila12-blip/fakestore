import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Product } from '../types';

interface ProductDetailsProps {
  addToCart: (product: Product) => void;
  isDarkMode: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ addToCart, isDarkMode }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products/${id}`)
      .then(res => {
        setProduct(res.data);
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]" data-test="loading">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto p-4 text-center mt-20" data-test="error-state">
        <p className="text-xl font-bold text-red-600 mb-4">{error || 'Product not found'}</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-12 max-w-7xl">
      <Link to="/" className={`mb-10 inline-flex items-center font-black text-xs uppercase tracking-widest transition-all hover:-translate-x-2 ${isDarkMode ? 'text-pink-400 hover:text-white' : 'text-pink-500 hover:text-pink-700'}`} data-test="back-link">
        <span className="material-icons text-sm mr-2">arrow_back</span>
        Return to Collection
      </Link>
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 glass p-8 md:p-16 rounded-[3rem] shadow-2xl transition-colors duration-300 ${isDarkMode ? 'bg-rose-950/40' : 'bg-white/60'}`} data-test="product-details-container">
        <div className={`flex items-center justify-center p-12 rounded-[2.5rem] shadow-2xl relative group overflow-hidden bg-white`}>
          <img src={product.image} alt={product.title} className="h-[500px] w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" data-test="detail-image" />
          <div className="absolute top-6 right-6">
            <div className={`bg-pink-600 text-white px-4 py-2 rounded-2xl font-black text-sm shadow-xl`}>
              NEW ARRIVAL
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <span className={`${isDarkMode ? 'text-pink-400' : 'text-pink-600'} font-black uppercase tracking-[0.3em] text-xs`} data-test="detail-category">{product.category}</span>
            <h1 className={`text-5xl md:text-6xl font-black leading-[0.95] tracking-tighter ${isDarkMode ? 'text-white' : 'text-rose-950'}`} data-test="detail-title">{product.title}</h1>
            
            <div className="flex items-center space-x-4">
              <div className={`flex px-4 py-2 rounded-2xl items-center backdrop-blur-sm border ${isDarkMode ? 'text-yellow-400 bg-white/5 border-white/5' : 'text-yellow-500 bg-rose-900/5 border-pink-100'}`}>
                <span className="material-icons text-lg">star</span>
                <span className={`font-black ml-2 ${isDarkMode ? 'text-white' : 'text-rose-950'}`}>{product.rating?.rate}</span>
              </div>
              <span className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-pink-300/40' : 'text-pink-900/40'}`}>{product.rating?.count} verified reviews</span>
            </div>
          </div>

          <div className="flex items-baseline space-x-4">
            <p className={`text-6xl font-black ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`} data-test="detail-price">${product.price}</p>
            <p className="text-gray-400 line-through font-bold text-xl">${(product.price * 1.2).toFixed(2)}</p>
          </div>
          
          <div className="glass p-8 rounded-3xl space-y-4 border-0">
            <h3 className={`text-xs font-black uppercase tracking-widest opacity-40 ${isDarkMode ? 'text-white' : 'text-rose-950'}`}>Product Overview</h3>
            <p className={`leading-relaxed text-lg font-medium ${isDarkMode ? 'text-pink-100/70' : 'text-pink-900/70'}`} data-test="detail-description">{product.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => addToCart(product)}
              className={`flex-1 py-6 rounded-[2rem] font-black text-xl hover:scale-[1.03] active:scale-[0.97] transition-all shadow-2xl flex items-center justify-center space-x-4 group ${isDarkMode ? 'bg-white text-rose-950 shadow-pink-900/20' : 'bg-pink-600 text-white shadow-pink-200'}`}
              data-test="add-to-cart-detail-btn"
            >
              <span className="material-icons transition-transform group-hover:rotate-12">add_shopping_cart</span>
              <span>Add to Cart</span>
            </button>
            <button className={`p-6 rounded-[2rem] border-2 transition-all active:scale-90 ${isDarkMode ? 'border-pink-500/20 text-white hover:bg-rose-900' : 'border-pink-100 text-rose-950 hover:bg-pink-50'}`}>
              <span className="material-icons">favorite_border</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className={`text-center p-4 rounded-2xl ${isDarkMode ? 'bg-rose-900/50' : 'bg-pink-50'}`}>
              <span className={`material-icons mb-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>local_shipping</span>
              <p className="text-[10px] font-black uppercase tracking-widest text-pink-300">Fast Delivery</p>
            </div>
            <div className={`text-center p-4 rounded-2xl ${isDarkMode ? 'bg-rose-900/50' : 'bg-pink-50'}`}>
              <span className={`material-icons mb-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>verified</span>
              <p className="text-[10px] font-black uppercase tracking-widest text-pink-300">Authentic</p>
            </div>
            <div className={`text-center p-4 rounded-2xl ${isDarkMode ? 'bg-rose-900/50' : 'bg-pink-50'}`}>
              <span className={`material-icons mb-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>history</span>
              <p className="text-[10px] font-black uppercase tracking-widest text-pink-300">30 Day Return</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
