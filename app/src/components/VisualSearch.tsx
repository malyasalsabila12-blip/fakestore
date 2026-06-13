import React, { useState, useCallback } from 'react';

interface VisualSearchProps {
  onSearch: (results: any[]) => void;
  allProducts: any[];
  isDarkMode: boolean;
}

const VisualSearch: React.FC<VisualSearchProps> = ({ onSearch, allProducts, isDarkMode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processSearch = useCallback(() => {
    setIsProcessing(true);
    // Simulate AI processing time
    setTimeout(() => {
      // Simulate finding "similar" products by picking a random category from the pool
      const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
      const similarProducts = allProducts.filter(p => p.category === randomProduct.category).slice(0, 4);
      
      onSearch(similarProducts);
      setIsProcessing(false);
      setIsDragging(false);
    }, 1500);
  }, [allProducts, onSearch]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    processSearch();
  };

  return (
    <div 
      className={`relative mt-12 p-12 border-2 border-dashed rounded-[2.5rem] transition-all duration-500 flex flex-col items-center justify-center cursor-pointer group
        ${isDragging 
          ? 'border-pink-500 bg-pink-500/10 scale-[1.02] shadow-2xl ring-4 ring-pink-500/20' 
          : isDarkMode ? 'border-pink-900/30 hover:border-pink-500/50 bg-rose-950/30 backdrop-blur-sm' : 'border-pink-100 hover:border-pink-400 bg-white/30 backdrop-blur-sm'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isProcessing ? (
        <div className="flex flex-col items-center">
          <div className={`w-20 h-20 border-4 border-t-transparent rounded-full animate-spin mb-6 ${isDarkMode ? 'border-pink-400' : 'border-pink-600'}`}></div>
          <p className={`font-black uppercase tracking-widest text-xs animate-pulse ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>Neural Processing...</p>
        </div>
      ) : (
        <>
          <div className={`w-20 h-20 rounded-[1.5rem] mb-6 transition-all duration-500 flex items-center justify-center shadow-xl ${isDragging ? 'bg-pink-600 text-white animate-float' : isDarkMode ? 'bg-white text-rose-950' : 'bg-rose-950 text-white'}`}>
            <span className="material-icons text-4xl">spatial_tracking</span>
          </div>
          <h3 className={`text-xl font-black mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-rose-950'}`}>AI SPATIAL SEARCH</h3>
          <p className={`text-sm text-center font-bold uppercase tracking-widest max-w-xs leading-loose ${isDarkMode ? 'text-pink-200/40' : 'text-pink-900/40'}`}>
            Drop a product here <br /> to find similar items
          </p>
          {isDragging && (
            <div className="absolute inset-0 bg-pink-600/5 rounded-[2.5rem] flex items-center justify-center">
              <div className="bg-pink-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl animate-bounce">
                Release to Analyze
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VisualSearch;
