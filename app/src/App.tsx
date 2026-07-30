import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import LoyaltyInfo from './pages/LoyaltyInfo';
import SlideOverCart from './components/SlideOverCart';
import ScrollToTop from './components/ScrollToTop';
import { Product } from './types';
import './App.css';

function App() {
  const [cart, setCart] = useState<Product[]>([]);
  const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

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

  const handleUpdateUsername = (newUsername: string) => {
    setUser(newUsername);
    localStorage.setItem('user', newUsername);
  };

  const MainContent = () => {
    const location = useLocation();
    const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

    return (
      <div className={`min-h-screen transition-colors duration-300 relative bg-white`}>

        {user && (
          <Navbar 
            cartCount={cart.length} 
            username={user} 
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}
        <main className={`relative ${isAuthRoute ? 'pt-0' : 'pt-24'}`}>
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <SignUp /> : <Navigate to="/" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile username={user} onLogout={handleLogout} onUpdateUsername={handleUpdateUsername} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/loyalty" 
              element={user ? <LoyaltyInfo /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/" 
              element={user ? <Home addToCart={addToCart} removeOneFromCart={removeOneFromCart} cart={cart} favorites={favorites} toggleFavorite={toggleFavorite} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/product/:id" 
              element={user ? <ProductDetails addToCart={addToCart} removeOneFromCart={removeOneFromCart} cart={cart} favorites={favorites} toggleFavorite={toggleFavorite} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/cart" 
              element={user ? <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} /> : <Navigate to="/login" />} 
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
