import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Confetti from '../components/Confetti';
import { Product, Order } from '../types';

interface PaymentProps {
  clearCart: () => void;
  addOrder: (order: Order) => void;
  cart: Product[];
}

type PaymentMethod = 'card' | 'ewallet' | 'qris' | 'va' | 'paylater' | 'transfer' | 'cod' | 'retail';

const Payment: React.FC<PaymentProps> = ({ clearCart, addOrder, cart }) => {
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

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
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
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="border border-black p-4 bg-zinc-50 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sandbox Mode</span>
                <button 
                  type="button"
                  onClick={() => {
                    setName('malya salsabila');
                    setCardNumber('6512 3214 7274 9087');
                    setExpiry('08/29');
                    setCvv('333');
                  }}
                  className="text-[9px] font-black uppercase tracking-widest bg-black text-white px-3 py-1 hover:bg-zinc-800 transition"
                >
                  Fill Demo Card
                </button>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest leading-tight">
                malya salsabila | 6512 3214 7274 9087 | 08/29 | 333
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 block">Cardholder Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="MALYA SALSABILA"
                  className="w-full border border-zinc-200 p-4 text-sm font-black outline-none bg-white focus:border-black uppercase transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 block">Card Number</label>
                <input
                  required
                  type="text"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim())}
                  placeholder="0000 0000 0000 0000"
                  className="w-full border border-zinc-200 p-4 text-sm font-black outline-none bg-white focus:border-black transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 block">Expiry Date</label>
                  <input
                    required
                    type="text"
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full border border-zinc-200 p-4 text-sm font-black outline-none bg-white focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 block">CVV</label>
                  <input
                    required
                    type="password"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="***"
                    className="w-full border border-zinc-200 p-4 text-sm font-black outline-none bg-white focus:border-black transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'ewallet':
        const wallets = [
          { id: 'gopay', name: 'GoPay', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' },
          { id: 'shopeepay', name: 'ShopeePay', logo: 'https://product.shopeepay.com/static/images/logo/shopeepay-logo.svg' },
          { id: 'dana', name: 'DANA', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg' },
          { id: 'ovo', name: 'OVO', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg' }
        ];
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-2 gap-3">
              {wallets.map(wallet => (
                <button key={wallet.id} type="button" className="border border-zinc-200 p-6 flex flex-col items-center justify-center gap-3 hover:border-black transition group relative overflow-hidden bg-zinc-50">
                   <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-icons text-xs">check_circle</span>
                   </div>
                  <img src={wallet.logo} alt={wallet.name} className="h-6 w-auto object-contain grayscale group-hover:grayscale-0 transition-all" />
                  <span className="text-[9px] font-black uppercase tracking-widest">{wallet.name}</span>
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Phone Number linked to E-Wallet</label>
              <input
                required
                type="tel"
                placeholder="08XX-XXXX-XXXX"
                className="w-full border border-zinc-200 p-4 text-sm font-black outline-none bg-white focus:border-black transition-colors"
              />
            </div>
          </div>
        );
      case 'qris':
        return (
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 py-4">
            <div className="mx-auto w-64 h-64 bg-white border border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <img src="/qris-demo.svg" alt="QRIS Code" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-3">
              <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">
                Scan QRIS with your preferred payment app
              </p>
              <div className="flex justify-center gap-6 opacity-30 grayscale items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg" alt="GoPay" className="h-3" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg" alt="DANA" className="h-3" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg" alt="OVO" className="h-3" />
              </div>
            </div>
          </div>
        );
      case 'va':
        const banks = [
          { id: 'bca', name: 'BCA', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
          { id: 'mandiri', name: 'Mandiri', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg' },
          { id: 'bni', name: 'BNI', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Bank_Negara_Indonesia_logo_%282004%29.svg' },
          { id: 'bri', name: 'BRI', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/68/BANK_BRI_logo.svg' }
        ];
        return (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {banks.map(bank => (
              <button key={bank.id} type="button" className="w-full border border-zinc-200 p-5 flex justify-between items-center hover:border-black transition group bg-zinc-50">
                <div className="flex items-center gap-6">
                  <img src={bank.logo} alt={bank.name} className="h-4 w-auto object-contain grayscale group-hover:grayscale-0 transition-all" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{bank.name} Virtual Account</span>
                </div>
                <span className="material-icons text-sm opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
              </button>
            ))}
          </div>
        );
      case 'paylater':
        const paylaterApps = [
          { id: 'akulaku', name: 'Akulaku', logo: 'https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/icons/akulaku.svg' },
          { id: 'kredivo', name: 'Kredivo', logo: 'https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/icons/kredivo.svg' }
        ];
        return (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {paylaterApps.map(app => (
              <button key={app.id} type="button" className="w-full border border-zinc-200 p-5 flex justify-between items-center hover:border-black transition group bg-zinc-50">
                <div className="flex items-center gap-6">
                  <img src={app.logo} alt={app.name} className="h-4 w-auto object-contain grayscale group-hover:grayscale-0 transition-all" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{app.name} Paylater</span>
                </div>
                <span className="material-icons text-sm opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
              </button>
            ))}
          </div>
        );
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
