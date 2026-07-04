import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, MessageCircle, Smile, HelpCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-card border-x-0 border-b-0 p-6  relative z-50 text-white" style={{borderRadius : 0}}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Section Gauche : Email de contact */}
        <div className="font-bold text-sm tracking-wide hover:text-pink-200 transition-colors cursor-pointer">
          hello@anonymots.com
        </div>

        {/* Section Centre : Liens légaux */}
        <div className="flex space-x-6 text-sm font-bold">
          <Link to="/terms" className="hover:text-pink-200 transition-colors underline decoration-2 underline-offset-4">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:text-pink-200 transition-colors underline decoration-2 underline-offset-4">
            Privacy Policy
          </Link>
        </div>

        {/* Section Droite : Signature */}
        <div className="font-bold text-sm flex items-center gap-1.5">
          Made with love in Paris
          <span className="text-white text-lg leading-none">♥</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
