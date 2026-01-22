
import React, { useState, useEffect, useCallback } from 'react';
import { getHistoricalThbRates } from '../services/supabase';
import { HistoricalRate } from '../types';
import AdBanner from '../components/AdBanner';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoricalRate[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getHistoricalThbRates();
    setHistory(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-20">
      <div className="flex justify-between items-center px-2 py-4">
        <div className="text-left">
          <h2 className="text-2xl font-bold gold-text uppercase tracking-widest">မၢႆတွင်း ၶၼ်ငိုၼ်း</h2>
          <p className="text-slate-400 text-xs mt-1">THB to MMK History</p>
        </div>
        <button 
          onClick={load}
          className="p-3 bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors border border-white/5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </div>

      <div className="glass-card rounded-3xl p-4 border border-white/5">
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">ၶၼ်ငိုၼ်း 14 ဝၼ်း (Last 14 Days)</h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 10}}
                dy={10}
              />
              <YAxis 
                hide 
                domain={['dataMin - 1', 'dataMax + 1']} 
              />
              <Tooltip 
                contentStyle={{backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px'}}
                itemStyle={{color: '#818cf8'}}
              />
              <Area 
                type="monotone" 
                dataKey="rate" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRate)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <AdBanner type="banner" />

      <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
        <div className="bg-white/5 p-4 border-b border-white/5">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-tighter">မၢႆတွင်း ၶၼ်ငိုၼ်း (Price History List)</h3>
        </div>
        <div className="divide-y divide-white/5 max-h-80 overflow-y-auto custom-scrollbar">
          {[...history].reverse().map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors">
              <span className="text-slate-400 text-sm font-medium">{item.date}</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{item.rate.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">MMK</span>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm italic">
              No history found yet. Updates from Admin will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
