import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, MessageCircle, Smile, HelpCircle, Home, Menu, X } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // État pour ouvrir/fermer le menu sur mobile

  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/messages', icon: MessageCircle, label: 'Mes Messages' },
    { path: '/wellness', icon: Smile, label: 'Bien-être' },
    { path: '/quiz', icon: HelpCircle, label: 'Quiz' },
  ];

  // Fonction utilitaire pour fermer le menu quand on clique sur un lien
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="glass-card mx-4 mt-4 p-4 relative z-50">
      <div className="flex items-center justify-between">
        
        {/* Logo cliquable pour retourner à l'accueil */}
        <Link to="/" onClick={closeMenu} className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
          <Heart className="text-pink-500 animate-pulse" size={32} fill="currentColor" />
          <h1 className="text-2xl font-bold text-white tracking-wide">AnonyMots</h1>
        </Link>
        
        {/* Navigation Desktop */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/30 text-white font-semibold shadow-inner' 
                    : 'text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bouton Menu Mobile (Burger / Croix) */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Navigation Mobile - S'affiche uniquement si isMenuOpen est Vrai */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/30 text-white font-semibold' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="text-lg">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};

export default Header;

