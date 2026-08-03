import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Confetti from '../components/Confetti';
import { Product, Order, User } from '../types';

interface PaymentProps {
  clearCart: () => void;
  addOrder: (order: Order) => void;
  cart: Product[];
  user: User | null;
}

type PaymentMethod = 'card' | 'ewallet' | 'qris' | 'va' | 'paylater' | 'transfer' | 'cod' | 'retail';

const Payment: React.FC<PaymentProps> = ({ clearCart, addOrder, cart, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { total } = location.state || { total: 0 };
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(86399); // 24 hours in seconds

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const paymentMethods = [
    { id: 'card', label: 'Credit / Debit Card', icon: 'credit_card', group: 'Cards' },
    { id: 'va', label: 'Virtual Account', icon: 'account_balance', group: 'Bank Transfer' },
    { id: 'ewallet', label: 'E-Wallet', icon: 'account_balance_wallet', group: 'Digital Wallet' },
    { id: 'qris', label: 'QRIS', icon: 'qr_code_2', group: 'Digital Wallet' },
    { id: 'paylater', label: 'Paylater', icon: 'update', group: 'Buy Now Pay Later' },
    { id: 'transfer', label: 'Manual Transfer', icon: 'payments', group: 'Bank Transfer' },
    { id: 'retail', label: 'Retail Outlet', icon: 'storefront', group: 'Cash' },
    { id: 'cod', label: 'Cash on Delivery', icon: 'local_shipping', group: 'Cash' },
  ];

  const handleXenditCheckout = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post('http://localhost:3001/api/create-invoice', {
        amount: Math.round(total),
        payerEmail: user?.email || 'customer@example.com',
        description: `Malstro Order for ${user?.username || 'Guest'}`,
        externalID: `MAL-${Date.now()}`
      });

      if (response.data.invoice_url) {
        window.location.href = response.data.invoice_url;
      } else {
        throw new Error('Failed to get invoice URL');
      }
    } catch (error: any) {
      console.error('Payment Error:', error);
      const errorMsg = error.response?.data?.details?.message || error.message || 'Failed to initialize payment.';
      alert(`Payment Error: ${errorMsg}\n\nPlease check if your Xendit API Key has "Invoices: Write" permission enabled in the Dashboard.`);
      setIsProcessing(false);
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    const xenditMethods = ['card', 'va', 'ewallet', 'qris', 'paylater', 'retail'];
    if (xenditMethods.includes(selectedMethod)) {
      handleXenditCheckout();
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      setShowConfetti(true);
      setIsProcessing(false);
      
      const newOrder: Order = {
        id: `MAL-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString(),
        total: total,
        items: [...cart],
        status: 'completed',
        paymentMethod: paymentMethods.find(m => m.id === selectedMethod)?.label || 'Unknown'
      };
      
      addOrder(newOrder);

      setTimeout(() => {
        alert('Payment Successful! Thank you for your purchase.');
        clearCart();
        navigate('/');
      }, 2000);
    }, 1500);
  };

  const renderPaymentForm = () => {
    const isXenditMethod = ['card', 'va', 'ewallet', 'qris', 'paylater', 'retail'].includes(selectedMethod);
    
    if (isXenditMethod) {
      return (
        <div className="bg-zinc-50 border border-zinc-200 p-10 text-center space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center border border-zinc-100 shadow-sm">
            <span className="material-icons text-3xl">payments</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest">Secure Checkout</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 leading-relaxed max-w-[280px] mx-auto">
              You will be redirected to Xendit's secure payment gateway to complete your purchase using {paymentMethods.find(m => m.id === selectedMethod)?.label}.
            </p>
          </div>
          <div className="flex justify-center gap-4 opacity-50 grayscale scale-75">
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 mt-1" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg" alt="GoPay" className="h-4 mt-1" />
          </div>
        </div>
      );
    }

    switch (selectedMethod) {
      case 'transfer':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-zinc-100 p-8 border-l-4 border-black">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Recipient Name</p>
              <p className="text-sm font-black uppercase tracking-widest mb-6">Malstro Official Store</p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Account Number</p>
              <p className="text-2xl font-black tracking-widest">0982-1234-5678</p>
              <p className="text-[10px] font-black uppercase tracking-widest mt-2">Bank Central Asia (BCA)</p>
            </div>
            <div className="flex items-center gap-3 text-red-600">
              <span className="material-icons text-sm">info</span>
              <p className="text-[9px] font-black uppercase tracking-widest">Please upload proof of transfer in the next step.</p>
            </div>
          </div>
        );
      case 'cod':
        return (
          <div className="bg-zinc-50 p-10 text-center space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 border border-zinc-200">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center border border-zinc-100 shadow-sm">
              <span className="material-icons text-3xl">local_shipping</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest">Cash on Delivery</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 leading-relaxed max-w-[280px] mx-auto">
                Pay with cash when your order arrives. Please ensure you have the exact amount ready.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-100 inline-block">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Extra Handling Fee</p>
              <p className="text-xs font-black uppercase">IDR 5.000</p>
            </div>
          </div>
        );
      case 'retail':
        const stores = [
          { id: 'alfamart', name: 'Alfamart', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Alfamart_logo.svg' },
          { id: 'indomaret', name: 'Indomaret', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Indomaret.svg' }
        ];
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-2 gap-3">
              {stores.map(store => (
                <button key={store.id} type="button" className="border border-zinc-200 p-8 flex flex-col items-center justify-center gap-4 hover:border-black transition group bg-zinc-50">
                  <img src={store.logo} alt={store.name} className="h-8 w-auto object-contain grayscale group-hover:grayscale-0 transition-all" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{store.name}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-4 text-center leading-relaxed">
              Show the payment code to the cashier at any selected outlet.
            </p>
          </div>
        );
      default:
        return <div className="p-12 text-center text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px]">Method Coming Soon</div>;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-black pb-20">
      <Confetti active={showConfetti} />
      
      {/* Xendit-Style Header/Progress */}
      <div className="bg-white border-b border-zinc-200 py-6 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-black text-white flex items-center justify-center font-black text-xl">M</div>
              <h1 className="text-sm font-black uppercase tracking-[0.2em]">Malstro Gateway</h1>
           </div>
           <div className="hidden md:flex items-center gap-12 text-[10px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-3 text-zinc-300"><span className="h-6 w-6 rounded-full border border-zinc-200 flex items-center justify-center">1</span> Bag</div>
              <div className="flex items-center gap-3 text-black"><span className="h-6 w-6 rounded-full border border-black flex items-center justify-center bg-black text-white">2</span> Payment</div>
              <div className="flex items-center gap-3 text-zinc-300"><span className="h-6 w-6 rounded-full border border-zinc-200 flex items-center justify-center">3</span> Order Placed</div>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          
          {/* Main Checkout Area */}
          <div className="space-y-6">
            <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-widest">Payment Methods</h2>
                  <div className="flex items-center gap-2 text-zinc-400">
                     <span className="material-icons text-sm">lock</span>
                     <span className="text-[9px] font-black uppercase tracking-widest">Secured by Malstro Pay</span>
                  </div>
               </div>

               <div className="grid md:grid-cols-[280px_1fr]">
                  {/* Left: Sidebar Categories */}
                  <div className="bg-zinc-50/50 border-r border-zinc-100 p-4 space-y-1">
                     {Array.from(new Set(paymentMethods.map(m => m.group))).map(group => (
                        <div key={group} className="py-2">
                           <p className="px-4 py-2 text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400">{group}</p>
                           {paymentMethods.filter(m => m.group === group).map(method => (
                              <button
                                 key={method.id}
                                 onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                                 className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all
                                    ${selectedMethod === method.id 
                                       ? 'bg-black text-white' 
                                       : 'text-zinc-500 hover:bg-zinc-100 hover:text-black'}`}
                              >
                                 <span className="material-icons text-base">{method.icon}</span>
                                 <span className="flex-1 text-left truncate">{method.label}</span>
                              </button>
                           ))}
                        </div>
                     ))}
                  </div>

                  {/* Right: Selected Form */}
                  <div className="p-8 md:p-12">
                     <div className="mb-10">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="material-icons text-black text-xl">
                              {paymentMethods.find(m => m.id === selectedMethod)?.icon}
                           </span>
                           <h3 className="text-xl font-black uppercase tracking-tight">
                              {paymentMethods.find(m => m.id === selectedMethod)?.label}
                           </h3>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pay securely using your preferred method.</p>
                     </div>

                     <form onSubmit={handlePayment} className="space-y-10">
                        <div className="min-h-[250px]">
                           {renderPaymentForm()}
                        </div>

                        <div className="pt-10 border-t border-zinc-100">
                           <button
                              type="submit"
                              disabled={isProcessing || showConfetti}
                              className={`w-full py-6 text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group
                                 ${isProcessing || showConfetti 
                                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
                                    : 'bg-black text-white hover:bg-zinc-900 active:scale-[0.98]'}`}
                           >
                              {isProcessing ? (
                                 <span className="material-icons animate-spin text-sm">sync</span>
                              ) : showConfetti ? (
                                 <span className="material-icons text-sm">check_circle</span>
                              ) : (
                                 <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                              )}
                              {isProcessing ? 'Processing Payment...' : showConfetti ? 'Success!' : `Confirm & Pay IDR ${total.toLocaleString()}`}
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>

            <button 
               onClick={() => navigate('/cart')}
               className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition group"
            >
               <span className="material-icons text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
               Back to shopping bag
            </button>
          </div>

          {/* Sidebar: Summary & Timer */}
          <div className="space-y-6">
             <div className="bg-white border border-zinc-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
                   <h2 className="text-xs font-black uppercase tracking-[0.2em]">Invoice Details</h2>
                   <span className="text-[9px] font-black uppercase tracking-widest bg-zinc-100 px-2 py-1">Draft</span>
                </div>

                <div className="space-y-6">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Total Payable</p>
                      <p className="text-3xl font-black tracking-tight">IDR {total.toLocaleString()}</p>
                   </div>

                   <div className="space-y-4 pt-6 border-t border-zinc-50">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span className="text-zinc-500">Merchant</span>
                         <span>Malstro Official</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span className="text-zinc-500">Order Ref</span>
                         <span>#ML-{Math.floor(Math.random() * 99999)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-red-600">
                         <span>Expires in</span>
                         <span className="flex items-center gap-1">
                            <span className="material-icons text-[12px]">timer</span>
                            {formatTime(timeLeft)}
                         </span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-black text-white p-6 flex items-center gap-4">
                <span className="material-icons text-3xl">help_outline</span>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest">Need help?</p>
                   <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Contact Malstro Support 24/7</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
