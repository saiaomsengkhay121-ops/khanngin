
import React, { useState, useEffect, useCallback } from 'react';
import { View, AppSettings } from './types';
import { getAppSettings } from './services/supabase';
import Navigation from './components/Navigation';
import Home from './views/Home';
import AllRates from './views/AllRates';
import Calculator from './views/Calculator';
import History from './views/History';
import Contact from './views/Contact';
import Admin from './views/Admin';
import PrivacyPolicy from './views/PrivacyPolicy';
import AdModal from './components/AdModal';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [showInterstitual, setShowInterstitual] = useState(false);
  const [targetView, setTargetView] = useState<View | null>(null);

  const loadData = useCallback(async () => {
    const data = await getAppSettings();
    setSettings(data);
  }, []);

  useEffect(() => {
    loadData();
    const handleHash = () => {
      if (window.location.hash === '#/admin-portal') {
        setCurrentView(View.ADMIN);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [loadData]);

  const handleNavigate = (view: View) => {
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Randomly show interstitial ad (20% chance) except for policy/contact/admin
    const skipAdViews = [View.CONTACT, View.ADMIN, View.PRIVACY_POLICY];
    if (!skipAdViews.includes(view) && view !== currentView && Math.random() > 0.8) {
      setTargetView(view);
      setShowInterstitual(true);
    } else {
      setCurrentView(view);
    }
  };

  const closeAdAndProceed = () => {
    setShowInterstitual(false);
    if (targetView) {
      setCurrentView(targetView);
      setTargetView(null);
    }
  };

  const renderView = () => {
    if (!settings) return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-xs font-bold tracking-widest animate-pulse uppercase">Connecting to Database...</p>
      </div>
    );

    switch (currentView) {
      case View.HOME: return <Home settings={settings} onNavigate={handleNavigate} />;
      case View.ALL_RATES: return <AllRates />;
      case View.CALCULATOR: return <Calculator settings={settings} />;
      case View.HISTORY: return <History />;
      case View.CONTACT: return <Contact />;
      case View.ADMIN: return <Admin settings={settings} onRefresh={loadData} />;
      case View.PRIVACY_POLICY: return <PrivacyPolicy onBack={() => handleNavigate(View.HOME)} />;
      default: return <Home settings={settings} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative flex flex-col bg-[#020617] shadow-2xl overflow-x-hidden">
      <div className="h-1 bg-gradient-to-r from-yellow-500 via-indigo-600 to-yellow-500"></div>
      
      <main className="flex-1 p-4 pb-12">
        {renderView()}

        {/* Global Footer & Disclaimer */}
        {currentView !== View.ADMIN && currentView !== View.PRIVACY_POLICY && (
          <footer className="mt-12 mb-20 px-4 space-y-6 opacity-60">
            <div className="h-[1px] bg-white/5 w-full"></div>
            <div className="text-center space-y-2">
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                <b>DISCLAIMER:</b> All rates and prices are for informational purposes only. We are not a financial advisor. Currency exchange can be volatile. Always verify with your local exchange before trading.
              </p>
              <p className="text-[10px] text-slate-500">
                &copy; {new Date().getFullYear()} Gold Live & Currency. Built for the community.
              </p>
            </div>
            <div className="flex justify-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              <button 
                onClick={() => handleNavigate(View.PRIVACY_POLICY)} 
                className="hover:text-yellow-500 transition-colors uppercase"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button 
                onClick={() => handleNavigate(View.CONTACT)} 
                className="hover:text-yellow-500 transition-colors uppercase"
              >
                Terms of Use
              </button>
              <span>•</span>
              <button 
                onClick={() => handleNavigate(View.CONTACT)} 
                className="hover:text-yellow-500 transition-colors uppercase"
              >
                Ad Choices
              </button>
            </div>
          </footer>
        )}
      </main>

      <AdModal isOpen={showInterstitual} onClose={closeAdAndProceed} />

      {currentView !== View.ADMIN && (
        <Navigation currentView={currentView} onNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default App;
