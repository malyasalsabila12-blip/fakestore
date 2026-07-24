import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  cartCount: number;
  username: string;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, username, onLogout, isDarkMode, toggleDarkMode, onOpenCart }) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b px-4 py-3 backdrop-blur-xl transition-all duration-300 md:px-6 ${
      isDarkMode ? 'border-[#3b0d1b]/60 bg-[#1b0e12]/80 text-white' : 'border-[#f2e8e8] bg-[#fffdfa]/90 text-[#111111]'
    }`} data-test="navbar">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/" className={`flex items-center gap-3 rounded-full px-3 py-2 shadow-sm ${isDarkMode ? 'border border-[#3b0d12] bg-[#261018]/80' : 'border border-[#f1d8d8] bg-white/80'}`} data-test="nav-logo">
            <img src="/malstro-logo.svg" alt="Malstro logo" className={`${isDarkMode ? 'h-10 w-10 rounded-full filter contrast-90' : 'h-10 w-10 rounded-full'}`} />
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.35em] ${isDarkMode ? 'text-pink-200' : 'text-[#b45309]'}`}>Malstro</p>
              <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-[#111111]'}`}>Modern commerce</p>
            </div>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <label className={`flex w-full max-w-xl items-center gap-3 rounded-full border px-4 py-3 shadow-sm ${isDarkMode ? 'border-[#3b0d1b] bg-[#261018]' : 'border-[#f2e8e8] bg-white'}`}>
            <span className={`material-icons text-lg ${isDarkMode ? 'text-[#fda4af]' : 'text-[#9ca3af]'}`}>search</span>
            <input type="text" placeholder="Search products" className={`w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-white placeholder:text-[#9ca3af]' : 'text-[#111111] placeholder:text-[#9ca3af]'}`} />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleDarkMode} className={`rounded-full p-2.5 transition ${isDarkMode ? 'bg-[#261018] text-[#fda4af]' : 'bg-[#e5e7eb] text-[#334155]'}`} aria-label="Toggle dark mode">
            <span className="material-icons text-base">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button onClick={onOpenCart} className="relative rounded-full bg-[#e53935] p-2.5 text-white shadow-sm transition hover:bg-[#c62828]" data-test="nav-cart">
            <span className="material-icons text-base">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#111111] text-[10px] font-semibold text-white" data-test="cart-count">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={onLogout} className={`rounded-full px-3 py-2 text-sm font-semibold ${isDarkMode ? 'bg-[#261018] text-white' : 'bg-[#111111] text-white'}`} data-test="logout-btn">
            {username}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
