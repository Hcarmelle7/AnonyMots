import React, { useEffect, useState } from 'react';

// Composant réutilisable pour afficher les bannières Google AdSense
// Affiche un encart stylisé en développement et charge la vraie pub en production
const AdSense = ({ 
  adSlot = '1234567890', 
  adFormat = 'auto', 
  fullWidthResponsive = 'true', 
  style = {}, 
  className = '' 
}) => {
  const [isDev, setIsDev] = useState(true);

  // Détecte si le script index.html a été configuré avec un vrai ID éditeur
  useEffect(() => {
    const adsenseScript = Array.from(document.querySelectorAll('script')).find(
      (s) => s.src && s.src.includes('pagead/js/adsbygoogle.js')
    );
    
    // Si l'identifiant n'est plus le template par défaut ca-pub-XXXXXXXXXXXXXXXX
    if (adsenseScript && !adsenseScript.src.includes('ca-pub-XXXXXXXXXXXXXXXX')) {
      setIsDev(false);
    }
  }, []);

  // Déclenche le chargement de l'annonce une fois le script initialisé
  useEffect(() => {
    if (!isDev) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.warn('Erreur affichage annonce AdSense:', err);
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
          Configure ton ID d'éditeur dans index.html pour afficher les pubs réelles.
        </p>
      </div>
    );
  }

  return (
    <div className={`adsense-container my-6 w-full flex justify-center overflow-hidden ${className}`} style={{ ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '250px', ...style }}
        data-ad-client="ca-pub-2008681476298160"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
};

export default AdSense;
