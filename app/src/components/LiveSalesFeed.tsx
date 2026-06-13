import React, { useState, useEffect } from 'react';

interface LiveSalesFeedProps {
  isDarkMode: boolean;
}

const LiveSalesFeed: React.FC<LiveSalesFeedProps> = ({ isDarkMode }) => {
  const [sale, setSale] = useState<{ user: string; item: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const users = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Morgan', 'Quinn'];
  const items = ['Backpack', 'Casual T-Shirt', 'Slim Fit Shirt', 'Cotton Jacket', 'Gold Ring', 'Hard Drive'];

  useEffect(() => {
    const showRandomSale = () => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      
      setSale({ user: randomUser, item: randomItem });
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        showRandomSale();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  if (!sale) return null;

  return (
    <div 
      className={`fixed top-20 left-4 z-40 transition-all duration-700 transform ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
    >
      <div className={`backdrop-blur-md border p-4 rounded-2xl shadow-2xl flex items-center space-x-4 max-w-xs ${isDarkMode ? 'bg-rose-900/80 border-pink-500/10' : 'bg-white/80 border-pink-100'}`}>
        <div className="bg-pink-600 rounded-full p-2 text-white animate-pulse">
          <span className="material-icons text-sm">shopping_cart</span>
        </div>
        <div>
          <p className={`text-xs font-bold uppercase tracking-tight ${isDarkMode ? 'text-pink-400' : 'text-pink-400'}`}>Recent Purchase</p>
          <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-rose-950'}`}>
            {sale.user} just bought a <span className="text-pink-600">{sale.item}</span>!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveSalesFeed;
