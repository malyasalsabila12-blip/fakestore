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
          <div className={`transition-transform duration-500 ${isOpen ? 'rotate-12 scale-125' : ''}`}>
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            )}
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-white/20 animate-pulse"></div>
        </button>
      ) : (
        <div className={`max-w-xs overflow-hidden rounded-[2rem] border p-8 shadow-2xl border-zinc-100 bg-white text-black animate-in fade-in zoom-in duration-300`}>
            <div className="flex items-start justify-between">
            <div className="text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <button onClick={() => setIsRevealed(false)} className="rounded-full p-2 transition hover:bg-zinc-100 text-zinc-400 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
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
