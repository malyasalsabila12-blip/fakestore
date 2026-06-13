import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Confetti from '../components/Confetti';
import { Product } from '../types';

interface CartProps {
  cart: Product[];
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  isDarkMode: boolean;
}

const Cart: React.FC<CartProps> = ({ cart, removeFromCart, clearCart, isDarkMode }) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number; type: 'percent' | 'flat' } | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const totalNum = cart.reduce((sum, item) => sum + item.price, 0);
  
  const calculateDiscount = () => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === 'percent') {
      return (totalNum * appliedDiscount.amount) / 100;
    }
    return appliedDiscount.amount;
  };

  const discountAmount = calculateDiscount();
  const finalTotal = Math.max(0, totalNum - discountAmount).toFixed(2);
  const total = totalNum.toFixed(2);

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

  // Milestone Rewards Logic
  const milestones = [
    { amount: 50, label: 'Free Shipping' },
    { amount: 100, label: '10% Discount' },
    { amount: 200, label: '$25 Gift Card' }
  ];

  const nextMilestone = milestones.find(m => totalNum < m.amount) || milestones[milestones.length - 1];
  const progress = Math.min((totalNum / nextMilestone.amount) * 100, 100);
  const isAllReached = totalNum >= milestones[milestones.length - 1].amount;

  return (
    <div className="container mx-auto p-4 md:p-12 max-w-7xl">
      <Confetti active={showConfetti} />
      <h1 className={`text-6xl font-black mb-12 text-center transition-colors duration-300 tracking-tighter ${isDarkMode ? 'text-white' : 'text-rose-950'}`} data-test="cart-title">SHOPPING <span className="text-gradient">CART</span></h1>
      
      {cart.length === 0 ? (
        <div className={`text-center glass p-20 rounded-[3rem] shadow-2xl border-0 transition-all ${isDarkMode ? 'bg-rose-950/40' : 'bg-white/60'}`} data-test="empty-cart-msg">
          <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner ${isDarkMode ? 'bg-rose-900/50' : 'bg-pink-50'}`}>
            <span className={`material-icons text-7xl ${isDarkMode ? 'text-rose-700' : 'text-pink-200'}`}>shopping_basket</span>
          </div>
          <p className={`text-xl mb-10 font-bold uppercase tracking-widest ${isDarkMode ? 'text-pink-300/40' : 'text-pink-900/40'}`}>Your cart is empty</p>
          <Link to="/" className={`px-12 py-5 rounded-[2rem] hover:scale-110 active:scale-95 transition-all font-black shadow-2xl uppercase tracking-widest text-sm ${isDarkMode ? 'bg-white text-rose-950' : 'bg-pink-600 text-white'}`}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Milestone Rewards Progress Bar */}
          <div className={`glass p-10 rounded-[3rem] shadow-2xl transition-colors duration-300 border-0 overflow-hidden relative ${isDarkMode ? 'bg-rose-950/40' : 'bg-white/60'}`}>
            <div className={`absolute top-0 right-0 p-8 opacity-10 ${isDarkMode ? 'text-white' : 'text-pink-200'}`}>
              <span className="material-icons text-[10rem]">stars</span>
            </div>
            <div className="flex justify-between items-end mb-6 relative z-10">
              <div>
                <h3 className={`text-xs font-black uppercase tracking-[0.3em] mb-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>Available Discounts</h3>
                <p className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-rose-900'}`}>
                  {isAllReached 
                    ? "MAX SAVINGS REACHED 🎉" 
                    : `ADD $${(nextMilestone.amount - totalNum).toFixed(2)} MORE FOR ${nextMilestone.label.toUpperCase()}`}
                </p>
              </div>
              <span className={`font-black text-xl ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>${total} / ${nextMilestone.amount}</span>
            </div>
            <div className={`w-full rounded-full h-6 overflow-hidden shadow-inner relative z-10 ${isDarkMode ? 'bg-rose-900' : 'bg-pink-50'}`}>
              <div 
                className={`h-full transition-all duration-1000 ease-out relative ${isDarkMode ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gradient-to-r from-pink-500 to-rose-600'}`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between mt-6 relative z-10">
              {milestones.map((m, i) => (
                <div key={i} className={`text-[10px] font-black uppercase tracking-widest text-center ${totalNum >= m.amount ? (isDarkMode ? 'text-pink-400' : 'text-pink-600') : 'text-pink-200'}`}>
                  <div className={`h-3 w-3 rounded-full mx-auto mb-3 shadow-lg ${totalNum >= m.amount ? (isDarkMode ? 'bg-pink-400 animate-pulse' : 'bg-pink-600 animate-pulse') : (isDarkMode ? 'bg-rose-900' : 'bg-pink-100')}`}></div>
                  {m.label}
                </div>
              ))}
            </div>
          </div>

          <div className={`glass rounded-[3rem] shadow-2xl overflow-hidden transition-colors duration-300 border-0 ${isDarkMode ? 'bg-rose-950/40' : 'bg-white/60'}`}>
            <div className="p-10 md:p-16 space-y-10">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className={`flex items-center border-b pb-10 last:border-0 last:pb-0 group ${isDarkMode ? 'border-rose-900/30' : 'border-pink-50'}`}>
                  <div className="h-32 w-32 bg-white rounded-3xl p-4 shadow-xl group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                    <img src={item.image} alt={item.title} className="h-full w-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 ml-10">
                    <h3 className={`font-black text-xl md:text-2xl tracking-tighter line-clamp-1 ${isDarkMode ? 'text-white' : 'text-rose-950'}`}>{item.title}</h3>
                    <p className={`text-xs font-black uppercase tracking-widest mt-2 ${isDarkMode ? 'text-pink-300/40' : 'text-pink-900/40'}`}>{item.category}</p>
                    <p className={`font-black text-2xl mt-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>${item.price}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(index)}
                    className={`transition-all p-4 rounded-2xl active:scale-90 ${isDarkMode ? 'text-rose-800 hover:text-red-500 hover:bg-red-500/10' : 'text-pink-200 hover:text-red-500 hover:bg-red-50'}`}
                    data-test="remove-item-btn"
                    title="Remove from cart"
                  >
                    <span className="material-icons text-3xl">delete_outline</span>
                  </button>
                </div>
              ))}
            </div>
            
            <div className={`p-10 md:p-16 flex flex-col space-y-10 border-t ${isDarkMode ? 'bg-rose-950/60 border-white/5' : 'bg-rose-950 border-black/5'}`}>
              {/* Voucher Section */}
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      placeholder="ENTER PROMO CODE"
                      className={`flex-1 px-8 py-5 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-black tracking-widest text-xs border-0 placeholder:text-pink-400/50 ${isDarkMode ? 'bg-rose-900 text-white' : 'bg-rose-900 text-white'}`}
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                    />
                    <button 
                      onClick={applyVoucher}
                      className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl ${isDarkMode ? 'bg-pink-600 text-white hover:bg-pink-500' : 'bg-white text-rose-950 hover:bg-pink-600 hover:text-white'}`}
                    >
                      Apply
                    </button>
                  </div>
                  {voucherError && <p className="text-red-500 text-[10px] mt-3 font-black uppercase tracking-widest ml-4">{voucherError}</p>}
                </div>
                {appliedDiscount && (
                  <div className={`border px-8 py-5 rounded-2xl flex items-center justify-between animate-in fade-in zoom-in duration-500 ${isDarkMode ? 'bg-pink-500/10 border-pink-500/20 text-pink-500' : 'bg-pink-500/10 border-pink-500/20 text-pink-500'}`}>
                    <div className="flex items-center">
                      <span className="material-icons text-lg mr-4">confirmation_number</span>
                      <span className="text-xs font-black uppercase tracking-widest">Voucher {appliedDiscount.code} Active</span>
                    </div>
                    <button onClick={() => setAppliedDiscount(null)} className="hover:scale-125 ml-6 transition-transform">
                      <span className="material-icons text-sm">close</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
                <div className="text-center md:text-left space-y-2">
                  {appliedDiscount && (
                    <div className="flex items-center justify-center md:justify-start text-xs font-black text-pink-400/60 uppercase tracking-widest line-through">
                      Subtotal: ${total}
                    </div>
                  )}
                  {appliedDiscount && (
                    <div className={`font-black text-xs uppercase tracking-widest ${isDarkMode ? 'text-pink-400' : 'text-pink-300'}`}>
                      Discount: -${discountAmount.toFixed(2)}
                    </div>
                  )}
                  <p className="text-pink-200/40 text-[10px] font-black uppercase tracking-[0.3em]">Estimated Total</p>
                  <p className="text-6xl font-black text-white tracking-tighter" data-test="cart-total">${finalTotal}</p>
                </div>
                <div className="flex items-center space-x-6 w-full md:w-auto">
                <button 
                  onClick={clearCart}
                  className="text-pink-200/40 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors p-4"
                  data-test="clear-cart-btn"
                >
                  Clear Cart
                </button>
                <button 
                  className={`flex-1 md:flex-none px-16 py-6 rounded-[2rem] font-black text-xl uppercase tracking-widest hover:scale-[1.03] active:scale-[0.97] transition-all ${isDarkMode ? 'bg-white text-rose-950 shadow-white/10' : 'bg-pink-600 text-white shadow-pink-200'}`}
                  data-test="checkout-btn"
                  onClick={() => {
                    setShowConfetti(true);
                    setTimeout(() => {
                      alert('Order placed successfully!');
                      clearCart();
                      setShowConfetti(false);
                    }, 500);
                  }}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Cart;

