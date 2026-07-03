import React, { useState, useEffect } from 'react';
import { Smile, Sparkles, Copy, Check, RefreshCw, Heart, Loader2, Zap, Wind, ThumbsUp, Sun } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import AdSense from '../components/AdSense';

const Wellness = () => {
  const [messages, setMessages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Liste des categories associees aux icones Lucide
  const categories = [
    { id: 'tous', label: 'Tous', dbValue: '', icon: Sparkles },
    { id: 'motivation', label: 'Motivation', dbValue: 'motivation', icon: Zap },
    { id: 'relaxation', label: 'Relaxation', dbValue: 'relaxation', icon: Wind },
    { id: 'encouragement', label: 'Encouragement', dbValue: 'encouragement', icon: ThumbsUp },
    { id: 'compassion', label: 'Compassion', dbValue: 'compassion', icon: Heart },
    { id: 'espoir', label: 'Espoir', dbValue: 'espoir', icon: Sun },
  ];

  useEffect(() => {
    fetchWellnessMessages();
  }, [selectedCategory]);

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
        setError("Impossible de charger les messages.");
      }
    } catch (err) {
      console.error("Erreur chargement citations:", err);
      setError("Erreur reseau. Verifie que le serveur est bien demarre.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Erreur de copie:", err);
    }
  };

  const currentMsg = messages[0];

  return (
    <div className="container mx-auto px-4 py-4 relative z-10">

      {/* Titre reduit pour gagner de la place */}
      <div className="text-center max-w-2xl mx-auto mb-4">
        <h1 className="text-3xl font-bold text-white mb-1">
          Bulles de Bienveillance
        </h1>
        <p className="text-sm text-white/85 leading-relaxed">
          Prends un instant pour lire ce mot doux et laisse-toi inspirer.
        </p>
      </div>

      {/* Selecteur de categories horizontal ultra compact avec vraies icones */}
      <div className="max-w-2xl mx-auto mb-5 flex flex-row overflow-x-auto whitespace-nowrap scrollbar-none gap-2 bg-white/10 backdrop-blur-md border border-white/20 p-1.5 rounded-xl select-none scroll-smooth">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-lg font-semibold text-xs transition-all duration-300 active:scale-95 flex-shrink-0 cursor-pointer flex items-center space-x-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-white text-[#764ba2] shadow-md scale-105 hover:scale-[1.05]'
                  : 'text-white/80 hover:bg-white/15 hover:text-white'
              }`}
            >
              <IconComponent size={14} className="shrink-0" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Zone de la carte reduite en hauteur */}
      <div className="max-w-md mx-auto space-y-4">

        {loading && messages.length === 0 && (
          <div className="text-center py-14 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col items-center justify-center space-y-3 min-h-[160px]">
            <Loader2 className="text-pink-300 animate-spin" size={32} />
            <p className="text-white text-sm font-medium">Sélection d'une pensée inspirante...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 bg-red-950/30 border border-red-500/20 rounded-2xl p-4 min-h-[160px] flex flex-col items-center justify-center">
            <p className="text-red-300 font-medium mb-3 text-sm">{error}</p>
            <Button onClick={fetchWellnessMessages} className="bg-white/20 hover:bg-white/30 text-white rounded-xl py-2 px-4 text-xs transition-all duration-200 active:scale-95">
              Réessayer
            </Button>
          </div>
        )}

        {!loading && !error && messages.length > 0 && currentMsg && (
          <div className="space-y-4">

            {/* Carte au format compact */}
            <Card className="glass-card border border-pink-400/20 shadow-xl relative overflow-hidden min-h-[150px] flex flex-col justify-between p-4 hover:translate-y-[-1px] transition-all duration-300">
              
              <div className="absolute top-[-10%] right-[-10%] w-20 h-20 bg-pink-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-20 h-20 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex justify-between items-center mb-2 relative z-10">
                <span className="bg-white/15 border border-white/10 text-white/90 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {categories.find(c => c.dbValue === currentMsg.category)?.label || currentMsg.category}
                </span>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(currentMsg.content, currentMsg.id)}
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 p-0 flex items-center justify-center cursor-pointer"
                  title="Copier la citation"
                >
                  {copiedId === currentMsg.id ? (
                    <Check size={16} className="text-green-300" />
                  ) : (
                    <Copy size={16} />
                  )}
                </Button>
              </div>

              <div className="flex-1 flex flex-col justify-center py-2 relative z-10">
                <Heart className="absolute top-0 left-2 text-pink-400/5" size={44} fill="currentColor" />
                <p className="text-white text-base sm:text-lg font-medium italic leading-relaxed text-center relative z-10 px-4">
                  "{currentMsg.content}"
                </p>
              </div>

            </Card>

            {/* Bouton de rechargement immediatement visible sous la carte */}
            <div className="text-center">
              <Button
                onClick={fetchWellnessMessages}
                disabled={loading}
                className="btn-primary text-xs px-5 py-2.5 rounded-lg flex items-center justify-center space-x-1.5 mx-auto transition-transform duration-200 hover:scale-[1.02] active:scale-95"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                <span>Recevoir un autre mot doux</span>
              </Button>
            </div>

          </div>
        )}

        {/* Espace Publicitaire AdSense integre directement pour une visibilite maximale */}
        <AdSense className="mt-4 shadow-lg rounded-xl max-w-sm mx-auto" />

      </div>
    </div>
  );
};

export default Wellness;
