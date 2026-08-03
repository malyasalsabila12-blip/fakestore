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
import Payment from './pages/Payment';
import SlideOverCart from './components/SlideOverCart';
import ScrollToTop from './components/ScrollToTop';
import { Product, User, Order } from './types';
import './App.css';

function App() {
  const [cart, setCart] = useState<Product[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser);
    } catch {
      // For backward compatibility if it was a plain string
      return { id: 1, username: savedUser, email: `${savedUser}@example.com` };
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      if (savedOrders.length === 0) {
        return [{
          id: 'MAL-827364',
          date: new Date(Date.now() - 86400000).toISOString(),
          total: 1649250,
          items: [{
            id: 1,
            title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
            price: 109.95,
            description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            rating: { rate: 3.9, count: 120 }
          }],
          status: 'completed',
          paymentMethod: 'Credit / Debit Card'
        }];
      }
      return savedOrders;
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

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

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleUpdateUsername = (newUsername: string) => {
    if (user) {
      const updatedUser = { ...user, username: newUsername };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const MainContent = () => {
    const location = useLocation();
    const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

    return (
      <div className={`min-h-screen transition-colors duration-300 relative bg-white`}>

        {user && (
          <Navbar 
            cartCount={cart.length} 
            username={user.username} 
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
              element={user ? <Profile user={user} onLogout={handleLogout} onUpdateUsername={handleUpdateUsername} orders={orders} /> : <Navigate to="/login" />} 
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
            <Route 
              path="/payment" 
              element={user ? <Payment clearCart={clearCart} addOrder={addOrder} cart={cart} user={user} /> : <Navigate to="/login" />} 
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
