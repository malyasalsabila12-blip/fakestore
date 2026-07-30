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
          className={`group relative flex h-16 w-16 items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 bg-black text-white shadow-2xl rounded-2xl border border-white/20 ${isOpen ? 'animate-bounce' : 'animate-float'}`}
          title="Open Mystery Box!"
        >
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black px-4 py-2 text-[8px] font-black uppercase tracking-[0.25em] text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-top-14 shadow-xl border border-white/10">
            Claim reward
          </div>
          <span className={`material-icons text-2xl transition-transform duration-500 ${isOpen ? 'rotate-12 scale-125' : ''}`}>
            {isOpen ? 'card_giftcard' : 'redeem'}
          </span>
          <div className="absolute inset-0 rounded-2xl border-2 border-white/20 animate-pulse"></div>
        </button>
      ) : (
        <div className={`max-w-xs overflow-hidden rounded-[2rem] border p-8 shadow-2xl border-zinc-100 bg-white text-black animate-in fade-in zoom-in duration-300`}>
            <div className="flex items-start justify-between">
            <div className="rounded-2xl bg-black p-4 text-white shadow-lg">
              <span className="material-icons">celebration</span>
            </div>
            <button onClick={() => setIsRevealed(false)} className="rounded-full p-2 transition hover:bg-zinc-100 text-zinc-400 hover:text-black">
              <span className="material-icons text-sm">close</span>
            </button>
          </div>
          <h3 className="mt-8 text-xl font-black uppercase tracking-widest leading-tight">Reward Unlocked</h3>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Apply at checkout</p>
          <div className={`mt-6 rounded-2xl border-2 border-dashed border-zinc-100 p-6 text-center bg-zinc-50/50`}>
            <span className="text-sm font-black uppercase tracking-widest text-black">{reward}</span>
          </div>
          <button onClick={() => setIsRevealed(false)} className="mt-8 w-full rounded-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-zinc-800 hover:shadow-xl active:scale-95">
            Got it
          </button>
        </div>
      )}
    </div>
  );
};

export default MysteryBox;
