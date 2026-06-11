import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Product } from '../types';

interface ProductDetailsProps {
  addToCart: (product: Product) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ addToCart }) => {
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
        <p className="text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto p-4 text-center mt-20" data-test="error-state">
        <p className="text-xl font-bold text-red-600 mb-4">{error || 'Product not found'}</p>
        <Link to="/" className="bg-blue-500 text-white px-6 py-2 rounded">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-flex items-center font-medium" data-test="back-link">
        <span className="material-icons mr-1">arrow_back</span>
        Back to products
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-xl shadow-lg" data-test="product-details-container">
        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
          <img src={product.image} alt={product.title} className="h-96 w-full object-contain mix-blend-multiply" data-test="detail-image" />
        </div>
        <div className="flex flex-col">
          <span className="text-blue-500 font-bold uppercase tracking-wider text-xs mb-2" data-test="detail-category">{product.category}</span>
          <h1 className="text-3xl font-bold text-gray-900 mb-4" data-test="detail-title">{product.title}</h1>
          
          <div className="flex items-center mb-6">
            <div className="flex text-yellow-400 mr-2">
              <span className="material-icons">star</span>
              <span className="text-gray-800 font-bold ml-1">{product.rating?.rate}</span>
            </div>
            <span className="text-gray-400 text-sm">({product.rating?.count} reviews)</span>
          </div>

          <p className="text-3xl font-bold text-blue-600 mb-6" data-test="detail-price">${product.price}</p>
          
          <div className="border-t border-b py-6 mb-8">
            <h3 className="text-sm font-bold text-gray-900 uppercase mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed" data-test="detail-description">{product.description}</p>
          </div>

          <button 
            onClick={() => addToCart(product)}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center space-x-2"
            data-test="add-to-cart-detail-btn"
          >
            <span className="material-icons">add_shopping_cart</span>
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
