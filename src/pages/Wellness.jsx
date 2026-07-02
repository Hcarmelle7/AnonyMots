import React, { useState, useEffect } from 'react';
import { Smile, Sparkles, Copy, Check, RefreshCw, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';

const Wellness = () => {
  // --- ÉTATS (STATES) ---
  const [messages, setMessages] = useState([]); // Liste des citations chargées (on n'affichera que la première)
  const [selectedCategory, setSelectedCategory] = useState('tous'); // Catégorie sélectionnée
  const [copiedId, setCopiedId] = useState(null); // ID pour le feedback de copie

  // États de chargement et d'erreur
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Liste des catégories disponibles avec traduction et emoji
  const categories = [
    { id: 'tous', label: '🌸 Tous', dbValue: '' },
    { id: 'motivation', label: '💪 Motivation', dbValue: 'motivation' },
    { id: 'relaxation', label: '🧘 Relaxation', dbValue: 'relaxation' },
    { id: 'encouragement', label: '🙌 Encouragement', dbValue: 'encouragement' },
    { id: 'compassion', label: '💚 Compassion', dbValue: 'compassion' },
    { id: 'espoir', label: '☀️ Espoir', dbValue: 'espoir' },
  ];

  // --- EFFETS (EFFECTS) ---
  // Charger une nouvelle citation dès que la catégorie change
  useEffect(() => {
    fetchWellnessMessages();
  }, [selectedCategory]);

  // --- ACTIONS (FONCTIONS) ---

  // Récupérer les messages bienveillants depuis le backend
  const fetchWellnessMessages = async () => {
    setLoading(true);
    setError('');

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

  // Copier dans le presse-papiers
  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Erreur de copie:", err);
    }
  };

  // On affiche uniquement le premier message du tableau (qui est tiré au hasard par le backend)
  const currentMsg = messages[0];

  // --- RENDU (JSX) ---
  return (
    <div className="container mx-auto px-4 py-8 relative z-10">

      {/* En-tête de la page */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        {/* <div className="inline-flex items-center justify-center p-3 bg-pink-500/20 rounded-full mb-4 border border-pink-400/20">
          <Smile className="text-pink-300" size={32} />
        </div> */}
        <h1 className="text-4xl font-bold text-white mb-3">
          Bulles de Bienveillance
        </h1>
        <p className="text-lg text-white/80 leading-relaxed">
          Prends un instant pour lire ce mot doux. Sélectionne une catégorie selon ton humeur et laisse-toi inspirer.
        </p>
      </div>

      {/* Sélecteur de catégories sous forme d'onglets horizontaux sur UNE SEULE ligne */}
      <div className="max-w-3xl mx-auto mb-10 flex flex-row overflow-x-auto whitespace-nowrap scrollbar-none gap-2 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl select-none scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex-shrink-0 ${selectedCategory === cat.id
                ? 'bg-white text-[#764ba2] shadow-lg scale-105'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Zone principale d'affichage de la carte unique */}
      <div className="max-w-md mx-auto">

        {/* Chargement */}
        {loading && messages.length === 0 && (
          <div className="text-center py-20 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-md">
            <div className="text-4xl animate-bounce mb-3">🌸</div>
            <p className="text-white text-lg font-medium">Sélection d'une pensée inspirante...</p>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="text-center py-10 bg-red-950/30 border border-red-500/20 rounded-3xl p-6">
            <p className="text-red-300 font-medium mb-4">⚠️ {error}</p>
            <Button onClick={fetchWellnessMessages} className="bg-white/20 hover:bg-white/30 text-white rounded-xl">
              Réessayer
            </Button>
          </div>
        )}

        {/* La Carte Unique de Citation */}
        {!loading && !error && messages.length > 0 && currentMsg && (
          <div className="space-y-6">

            {/* Carte Centrale Unique */}
            <Card className="glass-card border-2 border-pink-400/25 shadow-2xl relative overflow-hidden min-h-[260px] flex flex-col justify-between p-6 hover:translate-y-[-2px] transition-all duration-300">

              {/* Décorations de fond */}
              <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-pink-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex justify-between items-center mb-4 relative z-10">
                {/* Badge de catégorie */}
                <span className="bg-white/15 border border-white/10 text-white/90 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {categories.find(c => c.dbValue === currentMsg.category)?.label || `✨ ${currentMsg.category}`}
                </span>

                {/* Bouton de Copie */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(currentMsg.content, currentMsg.id)}
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-full w-9 h-9 p-0 flex items-center justify-center"
                  title="Copier la citation"
                >
                  {copiedId === currentMsg.id ? (
                    <Check size={18} className="text-green-300" />
                  ) : (
                    <Copy size={18} />
                  )}
                </Button>
              </div>

              {/* Texte de la citation */}
              <div className="flex-1 flex flex-col justify-center py-4 relative z-10">
                <Heart className="absolute top-0 left-2 text-pink-400/5" size={56} fill="currentColor" />
                <p className="text-white text-xl sm:text-2xl font-semibold italic leading-relaxed text-center relative z-10">
                  "{currentMsg.content}"
                </p>
              </div>

            </Card>

            {/* Bouton pour charger une autre citation aléatoire */}
            <div className="text-center pt-4">
              <Button
                onClick={fetchWellnessMessages}
                disabled={loading}
                className="btn-primary text-md px-6 py-3.5 rounded-xl flex items-center justify-center space-x-2 mx-auto"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span>✨ Recevoir un autre mot doux</span>
              </Button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Wellness;
