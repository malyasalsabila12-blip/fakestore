import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import SlideOverCart from './components/SlideOverCart';
import ScrollToTop from './components/ScrollToTop';
import { Product } from './types';
import './App.css';

function App() {
  const [cart, setCart] = useState<Product[]>([]);
  const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const exists = prev.includes(product.id);
      if (exists) return prev.filter(id => id !== product.id);
      return [...prev, product.id];
    });
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const removeOneFromCart = (product: Product) => {
    const index = cart.findIndex(item => item.id === product.id);
    if (index === -1) return;
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem('user', username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const MainContent = () => {
    const location = useLocation();
    const isLoginRoute = location.pathname === '/login';

    return (
      <div className={`min-h-screen transition-colors duration-700 relative overflow-hidden ${isDarkMode ? 'bg-[#1f0f14]' : 'bg-[#fffdfa]'}`}>

        {user && (
          <Navbar 
            cartCount={cart.length} 
            onLogout={handleLogout} 
            username={user} 
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}
        <main className={`relative z-10 ${isLoginRoute ? 'pt-0' : 'pt-24'}`}>
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={handleLogin} isDarkMode={isDarkMode} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/" 
              element={user ? <Home addToCart={addToCart} removeOneFromCart={removeOneFromCart} cart={cart} favorites={favorites} toggleFavorite={toggleFavorite} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/product/:id" 
              element={user ? <ProductDetails addToCart={addToCart} removeOneFromCart={removeOneFromCart} cart={cart} favorites={favorites} toggleFavorite={toggleFavorite} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/cart" 
              element={user ? <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>

        {user && (
          <SlideOverCart
            isOpen={isCartOpen}
            cart={cart}
            onClose={() => setIsCartOpen(false)}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    );
  };

  return (
    <Router>
      <ScrollToTop />
      <MainContent />
    </Router>
  );
}

export default App;
