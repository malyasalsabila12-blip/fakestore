import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  cartCount: number;
  username: string;
  onOpenCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, username, onOpenCart }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-zinc-100 py-2' 
          : 'bg-white border-transparent py-4'
      } border-b text-black`} 
      data-test="navbar"
    >
      <div className={`promo-bar transition-all duration-500 overflow-hidden ${scrolled ? 'h-0 opacity-0' : 'h-8 opacity-100 mb-2'}`}>
        <div className="bg-black py-1.5 text-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white">
          <Link to="/" className="hover:opacity-80">
            10% OFF + FREE GIFT + FREE SHIPPING | FIRST APP PURCHASE ONLY | USE CODE APP10
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 md:px-8">
        <div className="flex items-center">
          <Link to="/" className="flex items-center group" data-test="nav-logo">
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-[0.3em] group-hover:opacity-70 transition-opacity">MALSTRO</h1>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center md:flex max-w-2xl">
          <div className="relative w-full group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search products, brands and more..." 
              className="w-full bg-zinc-50 border border-transparent focus:border-black focus:bg-white rounded-full py-2.5 pl-12 pr-4 text-xs font-medium outline-none transition-all duration-300" 
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={onOpenCart} 
            className="group relative flex items-center transition hover:opacity-70 bg-transparent border-none shadow-none" 
            data-test="nav-cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-600 text-[8px] font-black text-white ring-2 ring-white group-hover:scale-110 transition-transform" data-test="cart-count">
                {cartCount}
              </span>
            )}
          </button>
          <Link 
            to="/profile" 
            className="flex items-center gap-2 group" 
            data-test="profile-link"
          >
            <div className="flex flex-col items-end mr-1 hidden sm:flex">
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Account</span>
              <span className="text-[9px] text-zinc-500 font-bold leading-tight">{username}</span>
            </div>
            <div className="flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
