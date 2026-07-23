import React, { useState } from 'react';

interface MysteryBoxProps {
  isDarkMode: boolean;
}

const MysteryBox: React.FC<MysteryBoxProps> = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [reward, setReward] = useState<string | null>(null);

  const rewards = [
    { code: 'SAVE10', label: '10% OFF Voucher' },
    { code: 'FREEBIE', label: '$10 Gift Card' },
    { code: 'LUCKY20', label: '20% OFF Voucher' },
    { code: 'SHIPPING', label: 'Free Shipping' }
  ];

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    
    // Animation delay for "opening"
    setTimeout(() => {
      const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
      setReward(randomReward.label + " (Code: " + (randomReward.code) + ")");
      setIsRevealed(true);
    }, 800);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {!isRevealed ? (
        <button 
          onClick={handleOpen}
          className={`group relative flex h-24 w-24 items-center justify-center rounded-[24px] transition-all duration-500 hover:scale-110 active:scale-95 ${
            isDarkMode
              ? 'bg-white/10 text-white ring-1 ring-white/10 border border-white/10 shadow-[0_24px_60px_-40px_rgba(255,255,255,0.18)]'
              : 'bg-[#111111] text-white shadow-lg'
          } ${isOpen ? 'animate-bounce' : 'animate-float'}`}
          title="Open Mystery Box!"
        >
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 ring-1 ring-white/10">
            Claim reward
          </div>
          <span className={`material-icons text-4xl transition-transform duration-500 ${isOpen ? 'rotate-12 scale-125' : ''}`}>
            {isOpen ? 'card_giftcard' : 'redeem'}
          </span>
          <div className="absolute inset-0 rounded-[24px] border-4 border-[#e53935]/25 animate-ping"></div>
        </button>
      ) : (
        <div className={`max-w-xs overflow-hidden rounded-[32px] border p-6 shadow-lg backdrop-blur-xl ${isDarkMode ? 'border-[#35131f] bg-[#231018]' : 'border-[#f2e8e8] bg-white'}`}>
            <div className="flex items-start justify-between">
            <div className="rounded-[18px] bg-[#e53935] p-3 text-white">
              <span className="material-icons">celebration</span>
            </div>
            <button onClick={() => setIsRevealed(false)} className="rounded-full p-2 bg-[#f8fafc] text-[#0f172a] transition hover:bg-[#e2e8f0] hover:text-[#0f172a]">
              <span className="material-icons text-sm">close</span>
            </button>
          </div>
          <h3 className={`mt-5 text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>You unlocked a reward</h3>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-[#fda4af]' : 'text-[#334155]'}`}>Use it at checkout for extra savings.</p>
          <div className={`mt-4 rounded-[22px] border p-4 text-center ${isDarkMode ? 'border-[#35131f] bg-[#2f1922]' : 'border-[#f2e8e8] bg-[#ffffff]'}`}>
            <span className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>{reward}</span>
          </div>
          <p className={`mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.25em] ${isDarkMode ? 'text-[#fda4af]' : 'text-[#b45309]'}`}>Apply this code at checkout</p>
        </div>
      )}
    </div>
  );
};

export default MysteryBox;
