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
          className={`group relative flex items-center justify-center w-24 h-24 rounded-3xl shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${
            isDarkMode ? 'bg-pink-600 shadow-pink-900/20' : 'bg-pink-500 shadow-pink-200'
          } ${isOpen ? 'animate-bounce' : 'animate-float'}`}
          title="Open Mystery Box!"
        >
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-rose-950 text-[9px] font-black px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-widest uppercase shadow-xl">
            CLAIM REWARD
          </div>
          <span className={`material-icons text-5xl transition-transform duration-500 ${isOpen ? 'rotate-12 scale-125' : ''} ${
            isDarkMode ? 'text-white' : 'text-white'
          }`}>
            {isOpen ? 'card_giftcard' : 'inventory_2'}
          </span>
          <div className={`absolute inset-0 rounded-3xl border-4 animate-ping ${
            isDarkMode ? 'border-pink-400/30' : 'border-pink-300/50'
          }`}></div>
        </button>
      ) : (
        <div className={`backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border animate-in zoom-in slide-in-from-bottom-8 duration-500 max-w-xs relative overflow-hidden ${isDarkMode ? 'bg-rose-900/80 border-pink-500/10' : 'bg-white/80 border-pink-100'}`}>
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <span className="material-icons text-8xl">celebration</span>
          </div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="bg-pink-600 rounded-2xl p-3 shadow-lg shadow-pink-500/20">
              <span className="material-icons text-white">celebration</span>
            </div>
            <button onClick={() => setIsRevealed(false)} className="text-gray-400 hover:text-rose-600 p-2 transition-colors">
              <span className="material-icons text-sm">close</span>
            </button>
          </div>
          <h3 className={`text-2xl font-black mb-2 tracking-tighter ${isDarkMode ? 'text-white' : 'text-rose-950'}`}>SUCCESS!</h3>
          <p className="text-xs text-gray-500 dark:text-pink-200/60 mb-6 font-bold uppercase tracking-widest leading-relaxed">You've unlocked a premium <br /> daily reward:</p>
          <div className={`p-6 rounded-2xl border text-center shadow-inner ${isDarkMode ? 'bg-rose-950 border-pink-500/10' : 'bg-pink-50 border-pink-100'}`}>
            <span className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>{reward}</span>
          </div>
          <p className="text-[9px] text-gray-400 mt-6 text-center font-black uppercase tracking-[0.2em] opacity-50">Apply this key at checkout</p>
        </div>
      )}
    </div>
  );
};

export default MysteryBox;
