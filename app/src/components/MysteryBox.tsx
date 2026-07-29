import React, { useState } from 'react';

interface MysteryBoxProps {
}

const MysteryBox: React.FC<MysteryBoxProps> = () => {
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
          className={`group relative flex h-20 w-20 items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 bg-gradient-to-br from-zinc-700 via-zinc-900 to-black text-white shadow-2xl border border-white/10 ${isOpen ? 'animate-bounce' : 'animate-float'}`}
          title="Open Mystery Box!"
        >
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-white opacity-0 transition-opacity group-hover:opacity-100">
            Claim reward
          </div>
          <span className={`material-icons text-3xl transition-transform duration-500 ${isOpen ? 'rotate-12 scale-125' : ''}`}>
            {isOpen ? 'card_giftcard' : 'redeem'}
          </span>
          <div className="absolute inset-0 border-2 border-red-600 animate-ping"></div>
        </button>
      ) : (
        <div className={`max-w-xs overflow-hidden border p-6 shadow-2xl border-black bg-white text-black`}>
            <div className="flex items-start justify-between">
            <div className="bg-red-600 p-3 text-white">
              <span className="material-icons">celebration</span>
            </div>
            <button onClick={() => setIsRevealed(false)} className="p-2 transition hover:opacity-50 text-black">
              <span className="material-icons text-sm">close</span>
            </button>
          </div>
          <h3 className="mt-5 text-lg font-black uppercase tracking-widest">Reward Unlocked</h3>
          <p className="mt-2 text-xs font-black uppercase tracking-widest text-zinc-500">Apply at checkout</p>
          <div className={`mt-4 border p-4 text-center border-black bg-zinc-50`}>
            <span className="text-sm font-black uppercase tracking-widest">{reward}</span>
          </div>
          <button onClick={() => setIsRevealed(false)} className="mt-6 w-full bg-black text-white py-3 text-[10px] font-black uppercase tracking-widest">
            Got it
          </button>
        </div>
      )}
    </div>
  );
};

export default MysteryBox;
