import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface CartProps {
  cart: Product[];
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, removeFromCart, clearCart }) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900" data-test="cart-title">Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-xl shadow-md border-2 border-dashed border-gray-200" data-test="empty-cart-msg">
          <span className="material-icons text-6xl text-gray-300 mb-4">shopping_basket</span>
          <p className="text-gray-500 text-lg mb-6">Your cart is feeling a bit light.</p>
          <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            {cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0" data-test={`cart-item-${item.id}`}>
                <img src={item.image} alt={item.title} className="h-20 w-20 object-contain mr-6 bg-gray-50 p-2 rounded" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-base md:text-lg line-clamp-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm mb-1">{item.category}</p>
                  <p className="text-blue-600 font-bold">${item.price}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  data-test="remove-item-btn"
                  title="Remove from cart"
                >
                  <span className="material-icons">delete_outline</span>
                </button>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-gray-500 text-sm">Order Total</p>
              <p className="text-3xl font-extrabold text-gray-900" data-test="cart-total">${total}</p>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <button 
                onClick={clearCart}
                className="text-gray-500 hover:text-red-600 text-sm font-medium transition-colors"
                data-test="clear-cart-btn"
              >
                Clear Cart
              </button>
              <button 
                className="flex-1 sm:flex-none bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95"
                data-test="checkout-btn"
                onClick={() => alert('Thanks for shopping! (Automation check)')}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
