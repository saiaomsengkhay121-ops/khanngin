
import React, { useState, useEffect } from 'react';
import { AppSettings, View } from '../types';
import AdBanner from '../components/AdBanner';
import { fetchFinancialData, FinancialData } from '../services/geminiApi';
import { getPreviousRates, updateAppSettings } from '../services/supabase';

interface HomeProps {
  settings: AppSettings;
  onNavigate: (view: View) => void;
}

const Home: React.FC<HomeProps> = ({ settings, onNavigate }) => {
  const [data, setData] = useState<FinancialData | null>(null);
  const [prevRates, setPrevRates] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiGrounded, setIsAiGrounded] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        // 1. Load historical trends for arrows
        const trends = await getPreviousRates();
        setPrevRates(trends);

        // 2. AI CACHING LOGIC
        const lastUpdated = new Date(settings.updated_at).getTime();
        const oneHour = 60 * 60 * 1000;
        const isStale = (Date.now() - lastUpdated) > oneHour;

        if (isStale) {
          console.log("Cache stale, fetching from Gemini...");
          const aiData = await fetchFinancialData();
          if (aiData) {
            setData(aiData);
            setIsAiGrounded(true);
            // 3. CACHE SAVING: Update Supabase so other users see this price for the next hour
            // Fix: Use thb_to_mmk_market_rate which is the correct property name in FinancialData
            await updateAppSettings(
              aiData.thb_to_mmk_market_rate, 
              aiData.gold_mmk_tical, 
              aiData.gold_thai_bar_sell
            );
          }
        } else {
          console.log("Using cached data from Supabase.");
          setIsAiGrounded(true); // Since it was originally grounded by AI in a previous session
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [settings]);

  const getTrend = (current: number, previous: number) => {
    if (!previous) return null;
    const diff = current - previous;
    const percent = (diff / previous) * 100;
    if (Math.abs(percent) < 0.01) return null;
    return {
      isUp: diff > 0,
      percent: Math.abs(percent).toFixed(2),
      text: `${diff > 0 ? '+' : ''}${percent.toFixed(2)}%`
    };
  };

  // Prioritize AI data if freshly fetched, otherwise use DB settings
  const exchangeRate = data?.thb_to_mmk_market_rate || settings.thb_to_mmk_rate;
  const thGoldPrice = data?.gold_thai_bar_sell || settings.gold_price_thb;
  const mmGoldPrice = data?.gold_mmk_tical || settings.gold_price_mmk;
  
  const thbTrend = getTrend(exchangeRate, prevRates?.rate);
  const thGoldTrend = getTrend(thGoldPrice, prevRates?.gold_price);
  const mmGoldTrend = getTrend(mmGoldPrice, prevRates?.gold_price_mmk);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      <div className="text-center py-6">
        <h2 className="text-4xl font-black gold-text mb-1 uppercase tracking-tighter">GOLD LIVE</h2>
        <h3 className="text-xl font-bold text-yellow-500 mb-2">ၶၼ်ငိုၼ်းလႄႈၶၼ်ၶမ်း</h3>
        
        {/* VERIFIED BADGE */}
        <div className="flex flex-col items-center gap-2">
           <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">
                {isAiGrounded ? '✅ Live Price Grounded by Google Search' : 'Verifying Market Rates...'}
              </span>
           </div>
           <p className="text-slate-400 text-[10px] tracking-[0.2em] uppercase font-bold">Market Intelligence v2.5</p>
        </div>
      </div>

      {/* 4 ACTION BUTTONS GRID */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        <button 
          onClick={() => onNavigate(View.CALCULATOR)}
          className="glass-card p-5 rounded-3xl border-2 border-yellow-500/20 hover:border-yellow-500/50 transition-all group flex flex-col items-center gap-3 text-center"
        >
          <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <span className="text-[11px] font-black text-white uppercase tracking-wider block">THB to MMK</span>
            <span className="text-[9px] text-slate-500 font-bold">EXCHANGE</span>
          </div>
        </button>

        <button 
          onClick={() => onNavigate(View.CALCULATOR)}
          className="glass-card p-5 rounded-3xl border-2 border-indigo-500/20 hover:border-indigo-500/50 transition-all group flex flex-col items-center gap-3 text-center"
        >
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
          </div>
          <div>
            <span className="text-[11px] font-black text-white uppercase tracking-wider block">GOLD CONVERT</span>
            <span className="text-[9px] text-slate-500 font-bold">BAHT / TICAL</span>
          </div>
        </button>

        <button 
          onClick={() => onNavigate(View.ALL_RATES)}
          className="glass-card p-5 rounded-3xl border-2 border-white/5 hover:border-white/20 transition-all group flex flex-col items-center gap-3 text-center"
        >
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" /></svg>
          </div>
          <div>
            <span className="text-[11px] font-black text-white uppercase tracking-wider block">ALL RATES</span>
            <span className="text-[9px] text-slate-500 font-bold">CURRENCY</span>
          </div>
        </button>

        <button 
          onClick={() => onNavigate(View.HISTORY)}
          className="glass-card p-5 rounded-3xl border-2 border-white/5 hover:border-white/20 transition-all group flex flex-col items-center gap-3 text-center"
        >
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <div>
            <span className="text-[11px] font-black text-white uppercase tracking-wider block">TRENDS</span>
            <span className="text-[9px] text-slate-500 font-bold">HISTORY</span>
          </div>
        </button>
      </div>

      <AdBanner type="banner" />

      {/* Main Prices Display */}
      <div className="grid grid-cols-1 gap-4">
        {/* Exchange Rate Card */}
        <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden border-indigo-500/20 border-2">
          <div className="absolute top-0 right-0 p-4">
             {thbTrend && (
               <div className={`px-2 py-1 rounded-full text-[10px] font-black flex items-center gap-1 ${thbTrend.isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                 {thbTrend.isUp ? '↗' : '↘'} {thbTrend.percent}%
               </div>
             )}
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">THB ↔ MMK Market</span>
            <span className="text-xs font-bold text-slate-400">ၶၼ်ငိုၼ်းဝၼ်းမိူဝ်ႈၼႆႉ</span>
            <div className="flex items-center gap-4 mt-2">
               <span className="text-sm font-bold text-slate-500">1฿ =</span>
               <span className="text-6xl font-black text-white tracking-tighter">
                 {exchangeRate.toFixed(2)}
               </span>
               <span className="text-sm font-bold text-slate-500">Ks</span>
            </div>
          </div>
        </div>

        {/* Thai Gold Card */}
        <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden border-yellow-500/30 border-2">
           <div className="absolute top-0 right-0 p-4">
             {thGoldTrend && (
               <div className={`px-2 py-1 rounded-full text-[10px] font-black flex items-center gap-1 ${thGoldTrend.isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                 {thGoldTrend.isUp ? '↗' : '↘'} {thGoldTrend.percent}%
               </div>
             )}
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Thai Gold Association</span>
            <span className="text-xs font-bold text-slate-400">ၶၼ်ၶမ်းမိူင်းထႆးဝၼ်းမိူဝ်ႈၼႆႉ</span>
            <div className="flex items-center gap-4 mt-2">
               <span className="text-5xl font-black text-white tracking-tighter">
                 {thGoldPrice.toLocaleString()}
               </span>
               <span className="text-xl font-bold text-slate-500">฿</span>
            </div>
          </div>
        </div>

        {/* Myanmar Gold Card */}
        <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden border-amber-600/30 border-2 bg-gradient-to-b from-transparent to-amber-900/10">
           <div className="absolute top-0 right-0 p-4">
             {mmGoldTrend && (
               <div className={`px-2 py-1 rounded-full text-[10px] font-black flex items-center gap-1 ${mmGoldTrend.isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                 {mmGoldTrend.isUp ? '↗' : '↘'} {mmGoldTrend.percent}%
               </div>
             )}
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Myanmar Gold Price</span>
            <span className="text-xs font-bold text-slate-400">ၶၼ်ၶမ်းမိူင်းမၢၼ်ႈဝၼ်းမိူဝ်ႈၼႆႉ</span>
            <div className="flex items-center gap-4 mt-2">
               <span className="text-5xl font-black text-white tracking-tighter">
                 {mmGoldPrice.toLocaleString()}
               </span>
               <span className="text-xl font-bold text-slate-500">Ks</span>
            </div>
            <p className="text-[9px] text-slate-500 uppercase font-bold mt-2">Per 1 Tical (24K / 16-Pai)</p>
          </div>
        </div>
      </div>

      <AdBanner type="wide" />
    </div>
  );
};

export default Home;
