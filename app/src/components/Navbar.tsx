import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  cartCount: number;
  username: string;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, username, onLogout, isDarkMode, toggleDarkMode }) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b p-4 flex justify-between items-center shadow-sm transition-all duration-300 ${
      isDarkMode 
        ? 'bg-rose-950/60 border-pink-500/10 text-white' 
        : 'bg-white/70 border-pink-100 text-gray-900'
    }`} data-test="navbar">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-2xl font-black tracking-tighter hover:scale-105 transition-transform" data-test="nav-logo">
          <span className={isDarkMode ? 'text-pink-400' : 'text-pink-600'}>FAKE</span> STORE
        </Link>
        <Link to="/" className={`text-sm font-bold transition-all hover:translate-y-[-2px] ${isDarkMode ? 'text-pink-300 hover:text-white' : 'text-pink-500 hover:text-pink-700'}`} data-test="nav-home">Home</Link>
      </div>
      
      <div className="flex items-center space-x-6">
        <button 
          onClick={toggleDarkMode}
          className={`p-2.5 rounded-xl transition-all active:scale-90 flex items-center justify-center shadow-inner ${
            isDarkMode ? 'bg-rose-900 hover:bg-rose-800' : 'bg-pink-50 hover:bg-pink-100'
          }`}
          aria-label="Toggle dark mode"
        >
          <span className={`material-icons text-xl ${isDarkMode ? 'text-pink-300' : 'text-pink-600'}`}>
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <div className="hidden sm:flex flex-col items-end">
          <span className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${isDarkMode ? 'text-rose-700' : 'text-pink-300'}`}>Authenticated</span>
          <span className="text-sm font-black" data-test="nav-username">{username}</span>
        </div>
        <Link to="/cart" className={`group relative p-2.5 rounded-xl transition-all hover:translate-y-[-2px] ${
          isDarkMode ? 'bg-pink-900/20 text-pink-400 hover:bg-pink-900/40' : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
        }`} data-test="nav-cart">
          <span className="material-icons">shopping_cart</span>
          {cartCount > 0 && (
            <span className={`absolute -top-1.5 -right-1.5 rounded-lg h-6 w-6 flex items-center justify-center text-[10px] font-black shadow-lg animate-bounce ${
              isDarkMode ? 'bg-pink-500 text-black shadow-pink-900/20' : 'bg-pink-600 text-white shadow-pink-200'
            }`} data-test="cart-count">
              {cartCount}
            </span>
          )}
        </Link>
        <button 
          onClick={onLogout}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg ${
            isDarkMode ? 'bg-white text-rose-950' : 'bg-pink-600 text-white hover:bg-pink-700'
          }`}
          data-test="logout-btn"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
