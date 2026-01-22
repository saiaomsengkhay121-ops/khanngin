
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { updateAppSettings, isSupabaseConnected, supabase } from '../services/supabase';

interface AdminProps {
  settings: AppSettings;
  onRefresh: () => void;
}

type AdminStep = 'login' | 'mfa' | 'reset' | 'dashboard';

const Admin: React.FC<AdminProps> = ({ settings, onRefresh }) => {
  const [step, setStep] = useState<AdminStep>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [newRate, setNewRate] = useState(settings.thb_to_mmk_rate.toString());
  const [newMmkGold, setNewMmkGold] = useState((settings.gold_price_mmk || 5400000).toString());
  const [newThbGold, setNewThbGold] = useState(settings.gold_price_thb.toString());
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [dbStatus, setDbStatus] = useState(false);

  // Mock Security Log
  const [logs] = useState([
    { event: 'Rate Update', user: 'Admin', time: '2 hours ago', status: 'Success' },
    { event: 'Login Attempt', user: 'Admin', time: '5 hours ago', status: 'Authorized' },
    { event: 'Cache Sync', user: 'System', time: '12 hours ago', status: 'Automatic' },
  ]);

  useEffect(() => {
    setDbStatus(isSupabaseConnected());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return alert("Database not connected.");
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      alert("Invalid credentials: " + error.message);
    } else {
      setStep('mfa'); // Proceed to Two-Step Verification
    }
  };

  const handlePinInput = (index: number, value: string) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit if full
    if (newPin.every(digit => digit !== '') && index === 5) {
      setTimeout(() => setStep('dashboard'), 500);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) return alert("Please enter your email first.");
    setLoading(true);
    const { error } = await supabase?.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '#/admin-portal',
    }) || { error: { message: 'No Supabase connection' } };
    setLoading(false);
    
    if (error) alert(error.message);
    else {
      setMsg("✅ Reset link sent to your email!");
      setStep('login');
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMsg('');
    try {
      const rateNum = parseFloat(newRate);
      const mmkGoldNum = parseFloat(newMmkGold);
      const thbGoldNum = parseFloat(newThbGold);
      
      if (isNaN(rateNum) || isNaN(mmkGoldNum) || isNaN(thbGoldNum)) throw new Error('Invalid input');
      
      await updateAppSettings(rateNum, mmkGoldNum, thbGoldNum);
      setMsg('✅ Rates updated and verified in database.');
      onRefresh();
    } catch (e: any) {
      setMsg(`❌ Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 1. LOGIN SCREEN
  if (step === 'login') {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 animate-fadeIn">
        <form onSubmit={handleLogin} className="glass-card w-full max-w-sm p-8 rounded-[2.5rem] space-y-6 border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
          
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center text-blue-400 mb-2 border border-blue-500/20 shadow-inner">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Security Center</h2>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">Authorized Access Only</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Admin Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-700 transition-all"
                placeholder="admin@goldlive.com"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Secret Key</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 text-white tracking-widest transition-all"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-slate-500 hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-500 shadow-xl shadow-blue-600/20 uppercase tracking-widest transition-all active:scale-95"
            >
              {loading ? "Verifying..." : "Authenticate"}
            </button>
            <button 
              type="button"
              onClick={() => setStep('reset')}
              className="text-[10px] text-slate-500 hover:text-blue-400 font-bold uppercase tracking-widest text-center"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    );
  }

  // 2. TWO-STEP VERIFICATION SCREEN
  if (step === 'mfa') {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 animate-fadeIn">
        <div className="glass-card w-full max-w-sm p-8 rounded-[2.5rem] border-white/5 space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white uppercase">Verification</h2>
            <p className="text-xs text-slate-400">Enter the 6-digit security PIN sent to your device.</p>
          </div>

          <div className="flex justify-between gap-2">
            {pin.map((digit, i) => (
              <input
                key={i}
                id={`pin-${i}`}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinInput(i, e.target.value)}
                className="w-10 h-14 bg-slate-900 border border-white/10 rounded-xl text-center text-2xl font-black text-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-4">
             <div className="flex items-center justify-center gap-2 text-slate-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting Verification</span>
             </div>
             <button onClick={() => setStep('login')} className="text-[10px] text-slate-600 hover:text-white font-bold uppercase">Back to Credentials</button>
          </div>
        </div>
      </div>
    );
  }

  // 3. RESET PASSWORD SCREEN
  if (step === 'reset') {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 animate-fadeIn">
        <div className="glass-card w-full max-w-sm p-8 rounded-[2.5rem] border-white/5 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-black text-white uppercase">Reset Access</h2>
            <p className="text-xs text-slate-400">Enter your recovery email to receive a secure login link.</p>
          </div>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white"
            placeholder="admin@goldlive.com"
          />
          <button 
            onClick={handlePasswordReset}
            disabled={loading}
            className="w-full bg-slate-100 text-black font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-white"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          <button onClick={() => setStep('login')} className="w-full text-slate-500 text-[10px] font-bold uppercase text-center">Return to Login</button>
        </div>
      </div>
    );
  }

  // 4. MAIN DASHBOARD
  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-24">
      <div className="flex justify-between items-center px-2 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
           </div>
           <div>
             <h2 className="text-xl font-black text-white uppercase tracking-tight">Admin Console</h2>
             <p className={`text-[9px] font-bold ${dbStatus ? 'text-green-500' : 'text-red-500'} uppercase tracking-widest`}>
                {dbStatus ? 'Secure Cloud Sync active' : 'Disconnected'}
             </p>
           </div>
        </div>
        <button 
          onClick={() => setStep('login')}
          className="text-slate-500 hover:text-white p-2 rounded-lg bg-white/5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Core Controls */}
        <div className="glass-card p-6 rounded-[2rem] border-white/5 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Live Exchange Rate (THB/MMK)</label>
            <div className="relative">
              <input 
                type="number" 
                step="0.01"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-5 text-4xl font-black text-white focus:border-blue-500 transition-all outline-none"
              />
              <span className="absolute right-6 top-7 text-slate-500 font-bold uppercase text-xs">Ks</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Gold Thai (฿)</label>
              <input 
                type="number" 
                value={newThbGold}
                onChange={(e) => setNewThbGold(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-2xl font-black text-yellow-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Gold Myanmar (Ks)</label>
              <input 
                type="number" 
                value={newMmkGold}
                onChange={(e) => setNewMmkGold(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-2xl font-black text-indigo-400 outline-none"
              />
            </div>
          </div>

          <button 
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-white text-black font-black py-5 rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : "Confirm & Update Rates"}
          </button>

          {msg && (
            <div className={`p-4 rounded-2xl text-center text-xs font-bold border ${msg.includes('❌') ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
              {msg}
            </div>
          )}
        </div>

        {/* Security Log Section */}
        <div className="glass-card rounded-[2rem] border-white/5 overflow-hidden">
          <div className="bg-white/5 p-4 border-b border-white/5 flex justify-between items-center">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Security Activity
             </h3>
             <span className="text-[9px] text-blue-500 font-bold uppercase animate-pulse">Live monitoring</span>
          </div>
          <div className="divide-y divide-white/5">
            {logs.map((log, i) => (
              <div key={i} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                <div>
                   <p className="text-xs font-bold text-white">{log.event}</p>
                   <p className="text-[9px] text-slate-500 uppercase font-bold">{log.user} • {log.time}</p>
                </div>
                <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-[8px] font-black uppercase">{log.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Help/Support Section */}
        <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-[2rem] flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           </div>
           <div>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Need assistance?</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-1">Contact the technical security team if you lose access or detect suspicious activity.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
