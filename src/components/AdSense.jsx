import React, { useEffect, useState } from 'react';

/**
 * Reusable Google AdSense component.
 * In production/real settings, it renders the AdSense ins tag and triggers adsbygoogle push.
 * In development or when the publisher ID is ca-pub-XXXXXXXXXXXXXXXX (placeholder),
 * it displays a beautiful glassmorphic placeholder so that the UI remains premium.
 */
const AdSense = ({ 
  adSlot = '1234567890', 
  adFormat = 'auto', 
  fullWidthResponsive = 'true', 
  style = {}, 
  className = '' 
}) => {
  const [isDev, setIsDev] = useState(true);

  // Check if we have a real AdSense config or if we are in local development
  useEffect(() => {
    // If the index.html script tag is modified with a real ca-pub ID, and not the placeholder XXXXXX
    const adsenseScript = Array.from(document.querySelectorAll('script')).find(
      (s) => s.src && s.src.includes('pagead/js/adsbygoogle.js')
    );
    
    if (adsenseScript && !adsenseScript.src.includes('ca-pub-XXXXXXXXXXXXXXXX')) {
      setIsDev(false);
    }
  }, []);

  useEffect(() => {
    if (!isDev) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.warn('AdSense block could not load ad:', err);
      }
    }
  }, [isDev]);

  if (isDev) {
    return (
      <div 
        className={`bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 text-center my-6 flex flex-col items-center justify-center min-h-[140px] shadow-lg relative overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/20 select-none ${className}`}
        style={{ ...style }}
      >
        <div className="absolute top-[-20%] right-[-10%] w-20 h-20 bg-pink-500/5 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-white/60 font-semibold text-xs tracking-widest uppercase">Espace Publicitaire</span>
        </div>
        <p className="text-white text-sm font-medium">Annonce Partenaire Google AdSense</p>
        <p className="text-white/40 text-xs mt-1 max-w-[280px] leading-relaxed">
          Configurez votre identifiant éditeur dans index.html pour charger vos annonces réelles.
        </p>
      </div>
    );
  }

  // Real AdSense output
  return (
    <div className={`adsense-container my-6 w-full flex justify-center overflow-hidden ${className}`} style={{ ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '250px', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Remplace ceci par ton identifiant réel
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
};

export default AdSense;
