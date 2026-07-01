import React from 'react';
import { Heart } from 'lucide-react';

const FloatingHearts = () => {
  return (
    <div className="floating-hearts">
      {[...Array(9)].map((_, index) => (
        <div key={index} className="heart">
          <Heart size={20} fill="rgba(255, 255, 255, 0.6)" />
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;

