import React, { useState, useEffect } from 'react';
import { Smile, Sparkles, Copy, Check, RefreshCw, Heart, Compass } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Wellness = () => {
  // --- ÉTATS (STATES) ---
  const [messages, setMessages] = useState([]); // Liste des citations bienveillantes reçues du backend
  const [selectedCategory, setSelectedCategory] = useState('tous'); // Catégorie sélectionnée ('tous', 'motivation', etc.)
  const [copiedId, setCopiedId] = useState(null); // Pour afficher l'icône de succès de copie temporairement
  
  // États de chargement et d'erreur
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Liste des catégories disponibles avec leur traduction et icône pour un rendu esthétique
  const categories = [
    { id: 'tous', label: '🌸 Tous', dbValue: '' },
    { id: 'motivation', label: '💪 Motivation', dbValue: 'motivation' },
    { id: 'relaxation', label: '🧘 Relaxation', dbValue: 'relaxation' },
    { id: 'encouragement', label: '🙌 Encouragement', dbValue: 'encouragement' },
    { id: 'compassion', label: '💚 Compassion', dbValue: 'compassion' },
    { id: 'espoir', label: '☀️ Espoir', dbValue: 'espoir' },
  ];

  // --- EFFETS (EFFECTS) ---
  // Charger les messages dès que la catégorie sélectionnée change
  useEffect(() => {
    fetchWellnessMessages();
  }, [selectedCategory]);

  // --- ACTIONS (FONCTIONS) ---
  
  // Charger les messages bienveillants depuis le backend
  const fetchWellnessMessages = async () => {
    setLoading(true);
    setError('');
    
    // Construction de l'URL avec ou sans filtre de catégorie
    const categoryObj = categories.find(cat => cat.id === selectedCategory);
    let url = '/api/wellness-messages';
    if (categoryObj && categoryObj.dbValue) {
      url += `?category=${categoryObj.dbValue}`;
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setError("Impossible de charger les messages bienveillants.");
      }
    } catch (err) {
      console.error("Erreur chargement wellness:", err);
      setError("Erreur réseau. Vérifie que le serveur est bien démarré.");
    } finally {
      setLoading(false);
    }
  };

  // Copier le texte d'un message bienveillant dans le presse-papiers
  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000); // Rétablit l'icône originale après 2 secondes
    } catch (err) {
      console.error("Erreur de copie:", err);
    }
  };

  // --- RENDU (JSX) ---
  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      
      {/* En-tête de la page */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-pink-500/20 rounded-full mb-4 border border-pink-400/20">
          <Smile className="text-pink-300" size={32} />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Bulles de Bienveillance
        </h1>
        <p className="text-xl text-white/80 leading-relaxed">
          Prends un instant pour lire ces mots doux. Choisis une catégorie selon ton besoin du moment et laisse-toi inspirer.
        </p>
      </div>

      {/* Sélecteur de catégories sous forme d'onglets (Tabs) */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-wrap justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
              selectedCategory === cat.id
                ? 'bg-white text-[#764ba2] shadow-lg scale-105'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Zone principale d'affichage */}
      <div className="max-w-4xl mx-auto">
        
        {/* Chargement */}
        {loading && messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white text-xl">⏳ Sélection de mots doux inspirants...</p>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="text-center py-8 bg-red-950/30 border border-red-500/20 rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-red-300 font-medium mb-4">{error}</p>
            <Button onClick={fetchWellnessMessages} className="bg-white/20 hover:bg-white/30 text-white">
              Réessayer
            </Button>
          </div>
        )}

        {/* Affichage des citations */}
        {!loading && !error && messages.length > 0 && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {messages.map((msg) => (
                <Card key={msg.id} className="glass-card flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-300 border border-white/15 shadow-xl">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      {/* Badge avec la catégorie */}
                      <span className="bg-white/15 text-white/95 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {msg.category}
                      </span>
                      
                      {/* Bouton de copie ergonomique */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                        title="Copier la citation"
                      >
                        {copiedId === msg.id ? (
                          <Check size={16} className="text-green-300" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-2 flex-1 flex flex-col justify-center">
                    <p className="text-white text-lg font-medium italic leading-relaxed text-center">
                      "{msg.content}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bouton pour repiocher de nouvelles citations aléatoires */}
            <div className="text-center pt-6">
              <Button
                onClick={fetchWellnessMessages}
                disabled={loading}
                className="btn-primary text-lg px-8 py-3.5 rounded-xl flex items-center justify-center space-x-2 mx-auto"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                <span>✨ Recevoir d'autres mots doux</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wellness;
