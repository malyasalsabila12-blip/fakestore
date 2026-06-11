import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  cartCount: number;
  username: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, username, onLogout }) => {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-lg" data-test="navbar">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold mr-4" data-test="nav-logo">Fake Store</Link>
        <Link to="/" className="hover:text-blue-200 transition-colors" data-test="nav-home">Home</Link>
      </div>
      
      <div className="flex items-center space-x-6">
        <span className="text-sm font-medium hidden sm:inline" data-test="nav-username">Hello, {username}</span>
        <Link to="/cart" className="hover:text-blue-200 transition-colors flex items-center relative" data-test="nav-cart">
          <span className="material-icons mr-1">shopping_cart</span>
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold border-2 border-blue-600" data-test="cart-count">
              {cartCount}
            </span>
          )}
        </Link>
        <button 
          onClick={onLogout}
          className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm transition-colors"
          data-test="logout-btn"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
