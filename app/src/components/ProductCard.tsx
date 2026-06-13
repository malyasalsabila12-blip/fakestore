import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
  isDarkMode: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart, isDarkMode }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('product', JSON.stringify(product));
  };

  return (
    <div 
      className={`glass p-5 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col h-full group relative overflow-hidden cursor-grab active:cursor-grabbing border-0 ${isDarkMode ? 'bg-rose-950/40' : 'bg-white/40'}`} 
      data-test={`product-card-${product.id}`}
      draggable
      onDragStart={handleDragStart}
    >
      <div className={`overflow-hidden mb-6 rounded-2xl flex items-center justify-center p-6 shadow-inner transition-colors ${isDarkMode ? 'bg-white/90' : 'bg-white'}`}>
        <img 
          src={product.image} 
          alt={product.title} 
          className="h-48 w-full object-contain group-hover:scale-110 group-hover:rotate-2 transition-transform duration-700 ease-out mix-blend-multiply" 
          data-test="product-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Image+Not+Found';
          }}
        />
      </div>
      <h2 className={`text-lg font-black tracking-tight mb-2 transition-colors line-clamp-2 ${isDarkMode ? 'text-white group-hover:text-pink-400' : 'text-rose-950 group-hover:text-pink-600'}`} title={product.title} data-test="product-title">{product.title}</h2>
      <div className="flex justify-between items-center mb-6">
        <p className={`text-2xl font-black ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`} data-test="product-price">${product.price}</p>
        <span 
          className={`text-[9px] uppercase tracking-widest px-3 py-1 rounded-full font-black transition-colors ${isDarkMode ? 'text-pink-700 bg-pink-900/30' : 'text-pink-400 bg-pink-50'}`} 
          data-test="product-category"
        >
          {product.category}
        </span>
      </div>
      <div className="mt-auto flex space-x-3">
        <Link 
          to={`/product/${product.id}`} 
          className={`p-3 rounded-2xl text-sm flex-1 text-center font-black transition-all active:scale-95 border shadow-sm ${isDarkMode ? 'bg-rose-900 text-pink-100 border-pink-500/10 hover:bg-rose-800' : 'bg-white text-rose-950 border-pink-100 hover:bg-pink-50'}`}
          data-test="view-details-btn"
        >
          View
        </Link>
        <button 
          onClick={() => addToCart(product)}
          className={`p-3 rounded-2xl text-sm flex-1 font-black transition-all active:scale-95 shadow-lg flex items-center justify-center space-x-2 ${isDarkMode ? 'bg-pink-600 text-white hover:bg-pink-500 shadow-pink-900/40' : 'bg-pink-600 text-white hover:bg-pink-700 shadow-pink-200'}`}
          data-test="add-to-cart-btn"
        >
          <span className="material-icons text-sm">add_shopping_cart</span>
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
