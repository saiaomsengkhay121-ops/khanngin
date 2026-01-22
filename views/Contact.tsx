
import React, { useState } from 'react';
import AdModal from '../components/AdModal';

const Contact: React.FC = () => {
  const [showAd, setShowAd] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleReveal = () => {
    setShowAd(true);
  };

  const handleAdComplete = () => {
    setShowAd(false);
    setUnlocked(true);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-24">
      <AdModal isOpen={showAd} onClose={handleAdComplete} isRewarded />

      <div className="text-center py-4">
        <h2 className="text-2xl font-bold gold-text uppercase tracking-widest">ၵပ်းသိုပ်ႇ ႁဝ်းၶႃႈ</h2>
        <p className="text-slate-400 text-sm mt-1">Contact & Support</p>
      </div>

      <div className="glass-card rounded-3xl p-8 flex flex-col items-center text-center gap-6 border-2 border-indigo-500/20">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center text-black shadow-2xl shadow-yellow-500/30">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.855-1.246L3 20l1.226-5.146A9.016 9.016 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
        </div>

        {!unlocked ? (
          <div className="space-y-4 w-full">
            <h3 className="text-xl font-bold">Interested in Advertising?</h3>
            <p className="text-sm text-slate-400 px-4">
              To keep this service free for everyone, we show ads. Please watch a 5-second ad to reveal our direct contact links.
            </p>
            <button 
              onClick={handleReveal}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              Reveal Contact Details
            </button>
          </div>
        ) : (
          <div className="space-y-6 w-full animate-fadeIn">
            <div className="bg-green-500/10 border border-green-500/20 py-2 rounded-full text-green-400 text-xs font-bold uppercase tracking-widest">
                Unlocked Successfully
            </div>
            
            <div className="flex flex-col gap-3">
              <a href="https://t.me/yourusername" className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.52-.46-.01-1.33-.26-1.98-.48-.8-.27-1.43-.42-1.37-.89.03-.25.38-.51 1.03-.78 4.04-1.76 6.74-2.92 8.09-3.48 3.85-1.6 4.64-1.88 5.17-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.01.07.01.2 0 .22z"/></svg>
                </div>
                <div className="text-left">
                    <p className="text-sm font-bold">Telegram</p>
                    <p className="text-xs text-slate-500">@gold_live_official</p>
                </div>
              </a>

              <a href="https://facebook.com" className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 bg-blue-600/20 text-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
                </div>
                <div className="text-left">
                    <p className="text-sm font-bold">Facebook Page</p>
                    <p className="text-xs text-slate-500">Gold Live Shan</p>
                </div>
              </a>

              <a href="mailto:contact@goldlive.com" className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div className="text-left">
                    <p className="text-sm font-bold">Email Support</p>
                    <p className="text-xs text-slate-500">support@goldlive.com</p>
                </div>
              </a>
            </div>

            <p className="text-[10px] text-slate-500 mt-4 italic">
                Thank you for your business. We usually reply within 24 hours.
            </p>
          </div>
        )}
      </div>

      <div className="glass-card p-6 rounded-3xl border border-yellow-500/20">
         <h4 className="text-yellow-500 font-bold mb-2">Want to sell your ads here?</h4>
         <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            Reach thousands of users in the Shan-Myanmar border trading community. We offer banners, pop-ups, and highlighted cards.
         </p>
         <button className="text-xs font-bold text-slate-100 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">View Ad Pricing</button>
      </div>
    </div>
  );
};

export default Contact;
