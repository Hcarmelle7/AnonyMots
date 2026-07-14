import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Étend Vitest avec les assertions personnalisées de Testing Library (comme toBeInTheDocument)
expect.extend(matchers);

// Un composant simple pour valider le fonctionnement de React et de JSDOM
const DummyComponent = ({ text }) => {
  return (
    <div className="p-4 bg-purple-500 text-white rounded-lg">
      <h1 className="text-xl font-bold">Vérification de l'environnement de test</h1>
      <p>{text}</p>
    </div>
  );
};

describe('Vérification de l\'environnement de test Frontend', () => {
  it('devrait rendre le composant de test correctement avec le texte passé en props', () => {
    render(<DummyComponent text="Hello from Vitest & JSDOM !" />);
    
    // Vérifier si le titre principal est présent dans le DOM
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Vérification de l'environnement de test");
    
    // Vérifier si le texte passé en propriété est bien rendu
    const paragraph = screen.getByText('Hello from Vitest & JSDOM !');
    expect(paragraph).toBeInTheDocument();
  });
});
