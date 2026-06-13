import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import LiveSalesFeed from './components/LiveSalesFeed';
import { Product } from './types';
import './App.css';

function App() {
  const [cart, setCart] = useState<Product[]>([]);
  const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
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

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index: number) => {
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

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-700 relative overflow-hidden ${isDarkMode ? 'bg-rose-950 bg-dark-pattern' : 'bg-white bg-light-pattern'}`}>
        {/* Dynamic Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] animate-pulse ${isDarkMode ? 'bg-pink-600/10' : 'bg-pink-300/20'}`}></div>
          <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] animate-pulse ${isDarkMode ? 'bg-rose-600/10' : 'bg-rose-300/20'}`} style={{ animationDelay: '2s' }}></div>
        </div>

        {user && (
          <Navbar 
            cartCount={cart.length} 
            onLogout={handleLogout} 
            username={user} 
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        )}
        <LiveSalesFeed isDarkMode={isDarkMode} />
        <main className="pt-24 relative z-10">
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={handleLogin} isDarkMode={isDarkMode} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/" 
              element={user ? <Home addToCart={addToCart} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/product/:id" 
              element={user ? <ProductDetails addToCart={addToCart} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/cart" 
              element={user ? <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} isDarkMode={isDarkMode} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
