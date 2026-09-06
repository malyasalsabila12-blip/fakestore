import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Confetti from '../components/Confetti';
import { Product, User, Order } from '../types';

interface CartProps {
  cart: Product[];
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  user: User;
  addOrder: (order: Order) => void;
}

const Cart: React.FC<CartProps> = ({ cart, removeFromCart, clearCart, user, addOrder }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number; type: 'percent' | 'flat' } | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalNum = cart.reduce((sum, item) => sum + item.price, 0);

  const calculateDiscount = () => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === 'percent') {
      return (totalNum * appliedDiscount.amount) / 100;
    }
    return appliedDiscount.amount;
  };

  const discountAmount = calculateDiscount();
  const finalTotalNum = Math.max(0, totalNum - discountAmount);
  const finalTotal = finalTotalNum.toFixed(2);

  const getTriggerAmount = () => {
    if (cart.some(item => item.id === 1059 || item.title?.includes('(59)'))) return 10059;
    if (cart.some(item => item.id === 1054 || item.title?.includes('(54)'))) return 10054;
    if (cart.some(item => item.id === 1013 || item.title?.includes('(51)'))) return 13051;
    return Math.round(finalTotalNum * 15000);
  };

  const totalAmount = getTriggerAmount();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);

    // Xendit usually requires a minimum amount of 10,000 IDR
    if (totalAmount < 10000) {
      setIsProcessing(false);
      alert(`The total amount (IDR ${totalAmount.toLocaleString()}) is below the minimum required for payment (IDR 10,000). Please add more items to your bag.`);
      return;
    }

    try {
      const orderId = `MAL-${Date.now()}`;
      // Use relative path - Vite proxy handles this in dev, and Vercel in production
      const response = await axios.post('/api/checkout', {
        amount: totalAmount,
        payerEmail: user?.email || 'customer@example.com',
        description: `Malstro Order for ${user?.username || 'Guest'}`,
        externalID: orderId,
        successUrl: `${window.location.origin}/cart?status=success`,
        failureUrl: `${window.location.origin}/cart?status=failure&reason=${totalAmount % 100 === 51 ? '51' : 'INSUFFICIENT_BALANCE'}`,
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          category: item.category,
          quantity: 1
        }))
      });

      if (response.data.invoice_url) {
        const newOrder: Order = {
          id: orderId,
          date: new Date().toISOString(),
          total: totalAmount,
          items: [...cart],
          status: 'pending',
          paymentMethod: 'Xendit Gateway'
        };
        
        addOrder(newOrder);
        clearCart(); 
        window.location.href = response.data.invoice_url;
      } else {
        throw new Error('Failed to get invoice URL');
      }
    } catch (error: any) {
      console.error('Payment Error:', error);
      
      // Try to extract the most meaningful error message
      let errorMsg = 'Failed to initialize payment.';
      
      if (error.response?.data?.details?.message) {
        errorMsg = error.response.data.details.message;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.message === 'Network Error') {
        errorMsg = 'Could not connect to the payment server. Please ensure the backend is running.';
      } else {
        errorMsg = error.message || 'An unknown error occurred.';
      }
      
      const confirmDemo = window.confirm(
        `Payment Error: ${errorMsg}\n\nWould you like to SIMULATE a successful payment for testing purposes?\n\n(Click Cancel for more simulation options)`
      );

      if (confirmDemo) {
        simulateSuccess();
      } else {
        const simulateFailureOpt = window.confirm("Would you like to SIMULATE an 'INSUFFICIENT BALANCE' (Error 51) failure?");
        if (simulateFailureOpt) {
          simulateFailure('INSUFFICIENT_BALANCE', '51 - Insufficient Balance');
        } else {
          setIsProcessing(false);
        }
      }
    }
  };

  const simulateSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setShowConfetti(true);
      setIsProcessing(false);
      
      const newOrder: Order = {
        id: `SIM-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString(),
        total: Math.round(parseFloat(finalTotal) * 15000),
        items: [...cart],
        status: 'completed',
        paymentMethod: 'Simulated Xendit Payment'
      };
      
      addOrder(newOrder);
      clearCart();
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 1500);
  };

  const simulateFailure = (errorCode: string, errorMsg: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      
      const newOrder: Order = {
        id: `FAIL-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString(),
        total: totalAmount,
        items: [...cart],
        status: 'cancelled',
        paymentMethod: `Xendit Simulation (${errorCode})`
      };
      
      addOrder(newOrder);
      clearCart();
      navigate(`/cart?status=failure&reason=${errorCode}`);
    }, 1000);
  };

  const applyVoucher = () => {
    const code = voucherCode.trim().toUpperCase();
    setVoucherError('');

    if (code === 'SAVE10') {
      setAppliedDiscount({ code, amount: 10, type: 'percent' });
    } else if (code === 'FAKE50') {
      setAppliedDiscount({ code, amount: 50, type: 'percent' });
    } else if (code === 'FREEBIE') {
      setAppliedDiscount({ code, amount: 10, type: 'flat' });
    } else {
      setVoucherError('Invalid voucher code');
    }
    setVoucherCode('');
  };

  const milestones = [
    { amount: 50, label: 'Free Shipping' },
    { amount: 100, label: '10% Discount' },
    { amount: 200, label: '$25 Gift Card' }
  ];

  const nextMilestone = milestones.find(m => totalNum < m.amount) || milestones[milestones.length - 1];
  const progress = Math.min((totalNum / nextMilestone.amount) * 100, 100);
  const isAllReached = totalNum >= milestones[milestones.length - 1].amount;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
      <Confetti active={showConfetti} />
      
      <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-black dark:border-zinc-800 pb-8">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Checkout</p>
          <h1 className={`text-4xl font-black uppercase tracking-tight text-black`} data-test="cart-title">Your bag</h1>
        </div>
        <Link to="/" className={`text-[10px] font-black uppercase tracking-widest transition text-zinc-500 hover:text-black`}>Continue shopping</Link>
      </div>

        {cart.length === 0 ? (
        <div className={`border border-zinc-200 p-20 text-center bg-white`} data-test="empty-cart-msg">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-xl font-black uppercase tracking-widest">Your bag is empty</h2>
          <p className="mt-2 text-xs font-black uppercase tracking-widest text-zinc-500">Add a few favorites to see them here.</p>
          <Link to="/" className="mt-10 inline-flex bg-black px-10 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-zinc-800">Start shopping</Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className={`flex items-center gap-6 border p-6 border-zinc-200 bg-white`}>
                  <img src={item.image} alt={item.title} className="h-24 w-24 object-contain mix-blend-multiply bg-white p-2" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{item.category}</p>
                    <h3 className="mt-1 text-sm font-black uppercase tracking-tight truncate">{item.title}</h3>
                    <p className="mt-2 text-sm font-black">IDR {Math.round(item.price * 15000).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className={`border p-8 border-black bg-white sticky top-32`}>
              <h2 className="text-lg font-black uppercase tracking-[0.2em] border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">Summary</h2>
              
              <div className="space-y-4 text-xs font-black uppercase tracking-widest">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subtotal</span>
                  <span>IDR {Math.round(totalNum * 15000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Estimated Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span>-IDR {Math.round(discountAmount * 15000).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4">
                  <span>Total</span>
                  <span data-test="cart-total">IDR {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PROMO CODE"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="flex-1 border-b border-black dark:border-zinc-700 py-2 text-xs font-black outline-none bg-transparent"
                    data-test="promo-input"
                  />
                  <button onClick={applyVoucher} className="bg-black dark:bg-white dark:text-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:opacity-80" data-test="promo-apply-btn">Apply</button>
                </div>
                {voucherError && <p className="mt-2 text-[9px] font-black text-red-600 uppercase" data-test="promo-error">{voucherError}</p>}
              </div>

              <button 
                className="mt-10 w-full bg-black dark:bg-white dark:text-black text-white py-5 text-xs font-black uppercase tracking-[0.3em] hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3 group disabled:opacity-50"
                data-test="checkout-btn"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <span className="material-icons text-sm group-hover:scale-110 transition-transform">lock</span>
                    Secure Checkout — IDR {totalAmount.toLocaleString()}
                  </>
                )}
              </button>
              <button onClick={clearCart} className="mt-4 w-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white" data-test="clear-cart-btn">
                Clear Bag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;


