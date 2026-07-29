import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  cartCount: number;
  username: string;
  onLogout: () => void;
  onOpenCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, username, onLogout, onOpenCart }) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 border-zinc-100 bg-white text-black`} data-test="navbar">
      <div className="promo-bar py-2 text-center text-[10px] md:text-xs">
        <Link to="/" className="hover:underline">
          10% OFF + FREE GIFT + FREE SHIPPING | FIRST APP PURCHASE ONLY | USE CODE APP10
        </Link>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center" data-test="nav-logo">
            <h1 className="text-2xl font-black uppercase tracking-[0.2em]">MALSTRO</h1>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <label className={`flex w-full max-w-xl items-center gap-3 border px-4 py-2 border-black bg-white`}>
            <span className="material-icons text-lg">search</span>
            <input type="text" placeholder="What are you looking for?" className="w-full bg-transparent text-sm outline-none" />
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={onOpenCart} className="relative transition hover:opacity-70" data-test="nav-cart">
            <span className="material-icons text-xl">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white" data-test="cart-count">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={onLogout} className="text-xs font-bold uppercase tracking-wider hover:underline" data-test="logout-btn">
            {username}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
