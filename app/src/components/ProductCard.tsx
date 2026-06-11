import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-xl transition-all bg-white flex flex-col h-full group" data-test={`product-card-${product.id}`}>
      <div className="overflow-hidden mb-4 rounded">
        <img 
          src={product.image} 
          alt={product.title} 
          className="h-48 w-full object-contain group-hover:scale-105 transition-transform duration-300" 
          data-test="product-image" 
        />
      </div>
      <h2 className="text-lg font-semibold truncate mb-2" title={product.title} data-test="product-title">{product.title}</h2>
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-bold text-blue-600" data-test="product-price">${product.price}</p>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded capitalize">{product.category}</span>
      </div>
      <div className="mt-auto flex space-x-2">
        <Link 
          to={`/product/${product.id}`} 
          className="bg-gray-200 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-300 text-sm flex-1 text-center font-medium transition-colors"
          data-test="view-details-btn"
        >
          Details
        </Link>
        <button 
          onClick={() => addToCart(product)}
          className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm flex-1 font-medium transition-colors"
          data-test="add-to-cart-btn"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
