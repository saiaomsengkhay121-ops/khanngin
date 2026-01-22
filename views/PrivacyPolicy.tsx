
import React from 'react';
import { View } from '../types';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-24 text-slate-300">
      <div className="flex items-center gap-4 py-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold gold-text uppercase tracking-widest">Privacy Policy</h2>
      </div>

      <div className="glass-card rounded-3xl p-6 space-y-6 text-sm leading-relaxed border border-white/5">
        <section className="space-y-2">
          <h3 className="text-white font-bold text-lg uppercase tracking-tight">1. Introduction</h3>
          <p>
            Welcome to <b>Gold Live & Currency</b>. We value your privacy and are committed to protecting your personal data. This policy explains how we handle information when you use our application.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-white font-bold text-lg uppercase tracking-tight">2. Information Collection</h3>
          <p>
            We do not collect personal identification information from our regular users. We do not require you to create an account to view gold prices or currency rates. 
          </p>
          <p className="text-xs italic text-slate-500">
            Note: For administrators, we collect login credentials (email/password) via Supabase Auth to secure the management portal.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-white font-bold text-lg uppercase tracking-tight">3. Cookies & Google AdSense</h3>
          <p>
            This app uses <b>Google AdSense</b> to display advertisements. Google uses cookies to serve ads based on a user's prior visits to this website or other websites.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site.</li>
            <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" className="text-blue-400 underline">Ads Settings</a>.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-white font-bold text-lg uppercase tracking-tight">4. Third-Party Services</h3>
          <p>
            We utilize the following third-party services:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><b>Supabase:</b> For database management and authentication.</li>
            <li><b>ExchangeRate-API:</b> For fetching global currency data.</li>
          </ul>
          <p>Each of these services has its own privacy policy which you can review on their respective websites.</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-white font-bold text-lg uppercase tracking-tight">5. Data Accuracy</h3>
          <p>
            While we strive for 100% accuracy, the gold and currency rates provided are for informational purposes. <b>Gold Live</b> is not responsible for financial losses incurred by relying on these figures.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-white font-bold text-lg uppercase tracking-tight">6. Contact Us</h3>
          <p>
            If you have questions about this Privacy Policy, please contact us via our <b>Support</b> section in the navigation menu.
          </p>
        </section>

        <div className="pt-4 border-t border-white/5 text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="w-full bg-slate-800 text-slate-300 font-bold py-4 rounded-2xl hover:text-white transition-colors"
      >
        Return to Home
      </button>
    </div>
  );
};

export default PrivacyPolicy;
