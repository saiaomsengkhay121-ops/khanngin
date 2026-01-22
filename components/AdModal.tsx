
import React, { useState, useEffect } from 'react';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRewarded?: boolean;
}

const AdModal: React.FC<AdModalProps> = ({ isOpen, onClose, isRewarded }) => {
  const [timer, setTimer] = useState(isRewarded ? 5 : 3);

  useEffect(() => {
    if (isOpen && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, timer]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative glass-card max-w-sm w-full p-8 rounded-2xl border-2 border-yellow-500/50 flex flex-col items-center text-center">
        <div className="absolute -top-12 bg-yellow-500 text-black px-4 py-1 rounded-full font-bold text-sm shadow-lg">
          SPONSORED
        </div>
        
        <div className="w-full h-48 bg-slate-800 rounded-xl mb-6 flex items-center justify-center border border-white/10 relative overflow-hidden">
           <img src="https://picsum.photos/400/300?grayscale" className="absolute inset-0 object-cover opacity-50" alt="Ad" />
           <div className="relative z-10 text-white font-bold p-4">
              <h3 className="text-xl mb-2 gold-text">Best Gold Trading 2024</h3>
              <p className="text-xs text-slate-300">Join thousands of successful traders today. Low fees, instant withdrawal.</p>
           </div>
        </div>

        <h2 className="text-xl font-bold mb-2">
          {isRewarded ? 'Unlock Contact Info' : 'Special Offer For You'}
        </h2>
        
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          {isRewarded 
            ? "Thank you for supporting our free app. The contact details will be revealed after this short ad."
            : "Check out this amazing platform to maximize your gold investments."
          }
        </p>

        <button
          onClick={timer === 0 ? onClose : undefined}
          disabled={timer > 0}
          className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
            timer === 0 
              ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20' 
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {timer === 0 ? 'Close Ad & Continue' : `Wait ${timer}s to Close`}
        </button>
      </div>
    </div>
  );
};

export default AdModal;
