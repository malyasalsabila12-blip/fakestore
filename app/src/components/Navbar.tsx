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
            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors">search</span>
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
            className="group relative flex items-center transition hover:opacity-70" 
            data-test="nav-cart"
          >
            <span className="material-icons text-2xl">shopping_bag</span>
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
            <div className="h-10 w-10 rounded-full border border-zinc-100 flex items-center justify-center group-hover:border-black transition-colors overflow-hidden bg-zinc-50">
              <span className="material-icons text-xl">person_outline</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
