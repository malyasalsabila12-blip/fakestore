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
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#b45309]">Checkout</p>
          <h1 className={`text-3xl font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#111111]'}`} data-test="cart-title">Your bag</h1>
        </div>
        <Link to="/" className={`text-sm font-semibold transition ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-[#6b7280] hover:text-[#111111]'}`}>Continue shopping</Link>
      </div>

        {cart.length === 0 ? (
        <div className={`${isDarkMode ? 'rounded-[36px] border border-[#35131f] bg-[#231018] p-10 text-center shadow-sm' : 'rounded-[36px] border border-[#f2e8e8] bg-white p-10 text-center shadow-sm'}`} data-test="empty-cart-msg">
          <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${isDarkMode ? 'bg-white/10 text-white' : 'bg-[#fff7ed] text-[#e53935]'}`}>
            <span className="material-icons text-4xl">shopping_basket</span>
          </div>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>Your cart is empty</h2>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-[#6b7280]'}`}>Add a few favorites to see them here.</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-[#e53935] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c62828]">Start shopping</Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className={`${isDarkMode ? 'rounded-[36px] border border-[#35131f] bg-[#231018] p-6 shadow-sm md:p-8' : 'rounded-[36px] border border-[#f2e8e8] bg-white p-6 shadow-sm md:p-8'}`}>
            <div className={`${isDarkMode ? 'rounded-[24px] bg-[#2f1922] p-5' : 'rounded-[24px] bg-[#fcf8f8] p-5'}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#b45309]">Rewards</p>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>{isAllReached ? 'Max savings reached' : `Add $${(nextMilestone.amount - totalNum).toFixed(2)} more`}</h3>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-300' : 'text-[#6b7280]'}`}>{nextMilestone.label}</p>
                </div>
                <span className="text-sm font-semibold text-[#e53935]">${total} / ${nextMilestone.amount}</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#f2e8e8]">
                <div className="h-full rounded-full bg-[#e53935] transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className={`${isDarkMode ? 'flex items-center gap-4 rounded-[24px] border border-[#35131f] bg-[#231018] p-4' : 'flex items-center gap-4 rounded-[24px] border border-[#f2e8e8] p-4'}`}>
                  <img src={item.image} alt={item.title} className="h-16 w-16 rounded-[16px] object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>{item.title}</p>
                    <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-300' : 'text-[#6b7280]'}`}>{item.category}</p>
                    <p className="mt-2 text-sm font-semibold text-[#e53935]">${item.price}</p>
                  </div>
                  <button onClick={() => removeFromCart(index)} className={`${isDarkMode ? 'rounded-full p-2 text-slate-300 transition hover:bg-white/5 hover:text-[#e53935]' : 'rounded-full p-2 text-[#9ca3af] transition hover:bg-[#fcf8f8] hover:text-[#e53935]'}`} data-test="remove-item-btn" title="Remove from cart">
                    <span className="material-icons text-base">delete_outline</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={`${isDarkMode ? 'rounded-[36px] border border-[#35131f] bg-[#231018] p-6 shadow-sm md:p-8' : 'rounded-[36px] border border-[#f2e8e8] bg-[#fcf8f8] p-6 shadow-sm md:p-8'}`}>
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>Order summary</h2>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm text-[#6b7280]">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              {appliedDiscount && (
                <div className="flex items-center justify-between text-sm text-[#6b7280]">
                  <span>Discount</span>
                  <span>- ${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-[#f2e8e8] pt-3 text-base font-semibold text-[#111111]">
                <span>Total</span>
                <span data-test="cart-total">${finalTotal}</span>
              </div>
            </div>

            <div className="mt-6">
              <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>Promo code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="SAVE10"
                  className={`${isDarkMode ? 'flex-1 rounded-full border border-[#35131f] bg-[#2f1922] px-4 py-3 text-sm text-white outline-none' : 'flex-1 rounded-full border border-[#f2e8e8] bg-white px-4 py-3 text-sm outline-none'}`}
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <button onClick={applyVoucher} className="rounded-full bg-[#111111] px-4 py-3 text-sm font-semibold text-white">Apply</button>
              </div>
              {voucherError && <p className="mt-2 text-sm text-[#c62828]">{voucherError}</p>}
            </div>

            <button
              className="mt-8 w-full rounded-full bg-[#e53935] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c62828]"
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
            <button onClick={clearCart} className={`${isDarkMode ? 'mt-3 w-full rounded-full border border-[#35131f] px-5 py-3 text-sm font-semibold text-slate-300' : 'mt-3 w-full rounded-full border border-[#f2e8e8] px-5 py-3 text-sm font-semibold text-[#6b7280]'}`} data-test="clear-cart-btn">
              Clear cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

