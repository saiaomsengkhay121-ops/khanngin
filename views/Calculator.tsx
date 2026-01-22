
import React, { useState } from 'react';
import { AppSettings } from '../types';
import AdBanner from '../components/AdBanner';

interface CalculatorProps {
  settings: AppSettings;
}

const Calculator: React.FC<CalculatorProps> = ({ settings }) => {
  const [calcMode, setCalcMode] = useState<'currency' | 'gold'>('currency');
  
  // Currency States
  const [thb, setThb] = useState<string>('1000');
  const [mmk, setMmk] = useState<string>((1000 * settings.thb_to_mmk_rate).toString());

  // Gold Unit States
  // 1 Thai Baht gold weight = 15.244g
  // 1 Myanmar Tical (Kyat-thar) = 16.606g
  // 1 Baht = 0.91798 Tical
  // 1 Tical = 1.08935 Baht
  const [bahtWeight, setBahtWeight] = useState<string>('1');
  const [ticalWeight, setTicalWeight] = useState<string>((1 * 0.918).toFixed(3));

  const handleThbChange = (val: string) => {
    setThb(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setMmk((num * settings.thb_to_mmk_rate).toFixed(2));
    } else {
      setMmk('');
    }
  };

  const handleMmkChange = (val: string) => {
    setMmk(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setThb((num / settings.thb_to_mmk_rate).toFixed(2));
    } else {
      setThb('');
    }
  };

  const handleBahtWeightChange = (val: string) => {
    setBahtWeight(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setTicalWeight((num * 0.91798).toFixed(3));
    } else {
      setTicalWeight('');
    }
  };

  const handleTicalWeightChange = (val: string) => {
    setTicalWeight(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setBahtWeight((num * 1.08935).toFixed(3));
    } else {
      setBahtWeight('');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="text-center py-2">
        <h2 className="text-2xl font-bold gold-text uppercase tracking-wider">ၸၢၵ်ႈၼပ်ႉသွၼ်ႇ</h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Multi-Tool Calculator</p>
      </div>

      {/* Mode Switcher */}
      <div className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-white/5 gap-2">
        <button 
          onClick={() => setCalcMode('currency')}
          className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${calcMode === 'currency' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-slate-400 hover:text-white'}`}
        >
          Currency (฿/Ks)
        </button>
        <button 
          onClick={() => setCalcMode('gold')}
          className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${calcMode === 'gold' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'}`}
        >
          Gold Weight (Baht/Tical)
        </button>
      </div>
      
      {calcMode === 'currency' ? (
        <div className="glass-card p-6 rounded-3xl border-2 border-white/5 space-y-4 animate-fadeIn">
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-widest pl-2">Thai Baht (THB)</label>
            <div className="relative">
              <input 
                type="number" 
                value={thb}
                onChange={(e) => handleThbChange(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-6 text-3xl font-black focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-white"
              />
              <div className="absolute right-6 top-7 font-bold text-slate-500">฿</div>
            </div>
          </div>

          <div className="flex justify-center -my-3 relative z-10">
            <div className="w-12 h-12 bg-slate-800 text-yellow-500 rounded-full border border-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-widest pl-2">Myanmar Kyat (MMK)</label>
            <div className="relative">
              <input 
                type="number" 
                value={mmk}
                onChange={(e) => handleMmkChange(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-6 text-3xl font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
              />
              <div className="absolute right-6 top-7 font-bold text-slate-500">Ks</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-6 rounded-3xl border-2 border-indigo-500/20 space-y-4 animate-fadeIn">
          <div className="space-y-2">
            <label className="text-xs text-indigo-400 font-bold uppercase tracking-widest pl-2">Thai Gold Weight (Baht)</label>
            <div className="relative">
              <input 
                type="number" 
                value={bahtWeight}
                onChange={(e) => handleBahtWeightChange(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-6 text-3xl font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
              />
              <div className="absolute right-6 top-7 font-bold text-slate-500 text-xs uppercase tracking-widest">Weight</div>
            </div>
            <p className="text-[10px] text-slate-500 pl-2">1 Baht weight = 15.244 Grams</p>
          </div>

          <div className="flex justify-center -my-3 relative z-10">
            <div className="w-12 h-12 bg-slate-800 text-indigo-400 rounded-full border border-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-indigo-400 font-bold uppercase tracking-widest pl-2">Myanmar Gold Weight (Tical/ၸွႆႉ)</label>
            <div className="relative">
              <input 
                type="number" 
                value={ticalWeight}
                onChange={(e) => handleTicalWeightChange(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-6 text-3xl font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
              />
              <div className="absolute right-6 top-7 font-bold text-slate-500 text-xs uppercase tracking-widest">Tical</div>
            </div>
            <p className="text-[10px] text-slate-500 pl-2">1 Myanmar Tical = 16.606 Grams</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 px-4 py-3 bg-slate-800/50 rounded-xl border border-white/5">
        <div className="flex justify-between text-xs">
           <span className="text-slate-400">Current Base Rate:</span>
           <span className="text-yellow-500 font-bold">1 THB = {settings.thb_to_mmk_rate} MMK</span>
        </div>
        <p className="text-[10px] text-slate-500 italic text-center">
            {calcMode === 'currency' 
              ? "Rates are updated frequently by our administration team." 
              : "Formula: 1 Thai Baht weight ≈ 0.918 Myanmar Tical weight."}
        </p>
      </div>

      <AdBanner type="square" />
    </div>
  );
};

export default Calculator;
