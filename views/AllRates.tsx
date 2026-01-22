
import React, { useState, useEffect } from 'react';
import { fetchThbRates } from '../services/currencyApi';
import { CurrencyRates } from '../types';
import AdBanner from '../components/AdBanner';

const AllRates: React.FC = () => {
  const [rates, setRates] = useState<CurrencyRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchThbRates();
        setRates(data.conversion_rates);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const majorCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'SGD', 'MYR', 'VND', 'KRW', 'LAK'];
  
  const filteredRates = rates ? Object.entries(rates).filter(([code]) => 
    code.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
      const aIsMajor = majorCurrencies.includes(a[0]);
      const bIsMajor = majorCurrencies.includes(b[0]);
      if (aIsMajor && !bIsMajor) return -1;
      if (!aIsMajor && bIsMajor) return 1;
      return 0;
  }) : [];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 animate-fadeIn pb-20">
      <div className="sticky top-0 z-20 bg-[#0f172a]/80 backdrop-blur-md pt-2 pb-4">
        <h2 className="text-2xl font-bold gold-text mb-4 text-center uppercase tracking-wider">ၶၼ်ငိုၼ်း တၢင်ႇမိူင်း</h2>
        <div className="relative">
          <input 
            type="text"
            placeholder="Search currency (e.g. USD)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white pl-10"
          />
          <svg className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredRates.map(([code, rate], index) => (
          <React.Fragment key={code}>
            <div className="glass-card p-4 rounded-xl flex items-center justify-between border-l-4 border-l-indigo-500/50 group hover:border-l-yellow-500 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-yellow-500 border border-white/5">
                  {code}
                </div>
                <div>
                  <p className="font-bold text-slate-100">{code}</p>
                  <p className="text-[10px] text-slate-500 uppercase">Thai Baht Base</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-white">{rate.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500">per 1 THB</p>
              </div>
            </div>
            {index === 4 && <div className="my-2"><AdBanner type="banner" /></div>}
            {index === 10 && <div className="my-2"><AdBanner type="banner" /></div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AllRates;
