
import React, { useEffect } from 'react';

interface AdBannerProps {
  type: 'banner' | 'square' | 'wide';
  adSlot?: string; // Add the data-ad-slot from your AdSense account here
}

const AdBanner: React.FC<AdBannerProps> = ({ type, adSlot }) => {
  useEffect(() => {
    // This script triggers Google to fill the ad slot after the component mounts
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("AdSense error:", e);
    }
  }, []);

  const getContainerStyles = () => {
    switch (type) {
      case 'banner': return 'min-h-[60px] w-full';
      case 'wide': return 'min-h-[100px] w-full';
      case 'square': return 'min-h-[250px] w-full max-w-[300px] mx-auto';
      default: return 'min-h-[60px] w-full';
    }
  };

  const getFormat = () => {
    switch (type) {
      case 'banner': return 'horizontal';
      case 'square': return 'rectangle';
      case 'wide': return 'horizontal';
      default: return 'auto';
    }
  };

  // If you don't have an adSlot yet, we show your custom beautiful placeholder
  if (!adSlot) {
    return (
      <div className={`${getContainerStyles()} bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-indigo-500/30 rounded-lg flex items-center justify-center overflow-hidden relative group animate-pulse cursor-pointer`}>
        <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">Advertisement</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center text-white font-bold text-[10px]">AD</div>
            <span className="text-xs text-slate-200">Space available for your business</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${getContainerStyles()} flex items-center justify-center overflow-hidden my-2`}>
      {/* Real Google Ad Unit */}
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // REPLACE WITH YOUR ID
        data-ad-slot={adSlot}
        data-ad-format={getFormat()}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner;
