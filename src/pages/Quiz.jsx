import React, { useState } from 'react';
import { HelpCircle, Sparkles, Copy, Check, RotateCcw, Heart, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Quiz = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1 = mood selection, 2 = needs, 3 = loading/result
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedNeed, setSelectedNeed] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const questions = {
    1: {
      title: "Comment te sens-tu globalement aujourd'hui ?",
      subtitle: "Choisis l'état d'esprit qui se rapproche le plus de ton ressenti.",
      options: [
        { id: 'triste', label: '😢 Triste / Mélancolique', value: 'triste' },
        { id: 'stresse', label: '🤯 Stressé(e) / Débordé(e)', value: 'stresse' },
        { id: 'anxieux', label: '😰 Anxieux(se) / Inquiet(e)', value: 'anxieux' },
        { id: 'fatigue', label: '🥱 Fatigué(e) / Épuisé(e)', value: 'fatigue' },
        { id: 'heureux', label: '😊 Heureux(se) / Joyeux(se)', value: 'heureux' },
        { id: 'confiant', label: '😎 Confiant(e) / Motivé(e)', value: 'confiant' },
      ]
    },
    2: {
      title: "De quoi as-tu le plus besoin en ce moment ?",
      subtitle: "Aide-nous à cibler le message de soutien idéal.",
      options: [
        { id: 'encouragement', label: '💬 De mots d\'encouragement', value: 'encouragement' },
        { id: 'calme', label: '🧘 D\'un instant de calme et de respiration', value: 'calme' },
        { id: 'energie', label: '💪 D\'un regain d\'énergie et de motivation', value: 'energie' },
        { id: 'douceur', label: '💚 D\'un peu de douceur et de compassion', value: 'douceur' },
      ]
    }
  };

  const handleSelectMood = (moodValue) => {
    setSelectedMood(moodValue);
    setCurrentStep(2);
  };

  const handleSelectNeed = async (needValue) => {
    setSelectedNeed(needValue);
    setCurrentStep(3);
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: selectedMood,
          needs: needValue
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResultMessage(data.personalized_message);
      } else {
        setError("Impossible de générer ton message personnalisé.");
      }
    } catch (err) {
      console.error("Erreur soumission quiz:", err);
      setError("Erreur réseau. Vérifie que le serveur est bien démarré.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedMood('');
    setSelectedNeed('');
    setResultMessage('');
    setError('');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(resultMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur copie message:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      
      {/* En-tete du module de quiz */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-purple-500/20 rounded-full mb-4 border border-purple-400/20">
          <HelpCircle className="text-purple-300" size={32} />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Quiz Bien-être
        </h1>
        <p className="text-lg text-white/80 leading-relaxed">
          Prends 10 secondes pour faire le point sur tes émotions et reçois une bulle de bien-être sur mesure.
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        
        {/* Choix de l'humeur */}
        {currentStep === 1 && (
          <Card className="glass-card border border-white/10 shadow-2xl animate-fadeIn">
            <CardHeader className="text-center pb-4">
              <span className="text-sm font-semibold uppercase tracking-wider text-purple-300">Question 1 sur 2</span>
              <CardTitle className="text-white text-xl mt-1">{questions[1].title}</CardTitle>
              <CardDescription className="text-white/80 text-sm mt-1">{questions[1].subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {questions[1].options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectMood(option.value)}
                  className="w-full text-left bg-white/15 hover:bg-white/25 border border-white/10 hover:border-white/20 text-white font-medium p-4 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  {option.label}
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Choix du besoin */}
        {currentStep === 2 && (
          <Card className="glass-card border border-white/10 shadow-2xl animate-fadeIn">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-between items-center text-sm font-semibold uppercase tracking-wider">
                <button onClick={() => setCurrentStep(1)} className="text-white/60 hover:text-white transition-all duration-200 active:scale-95 flex items-center gap-1 cursor-pointer">
                  <span>Retour</span>
                </button>
                <span className="text-purple-300">Question 2 sur 2</span>
              </div>
              <CardTitle className="text-white text-xl mt-3">{questions[2].title}</CardTitle>
              <CardDescription className="text-white/80 text-sm mt-1">{questions[2].subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {questions[2].options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectNeed(option.value)}
                  className="w-full text-left bg-white/15 hover:bg-white/25 border border-white/10 hover:border-white/20 text-white font-medium p-4 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  {option.label}
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Resultat de l'evaluation */}
        {currentStep === 3 && (
          <div className="animate-fadeIn">
            
            {loading && (
              <Card className="glass-card text-center py-12 border border-white/10 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="text-purple-300 animate-spin" size={48} />
                <CardTitle className="text-white text-2xl">Préparation de ta bulle...</CardTitle>
                <p className="text-white/70">
                  Nous sélectionnons un message inspirant adapté à ton humeur du moment.
                </p>
              </Card>
            )}

            {error && (
              <Card className="glass-card text-center py-8 border border-white/10">
                <CardContent className="space-y-4">
                  <p className="text-red-300 font-medium text-lg">{error}</p>
                  <Button onClick={handleReset} className="bg-white/20 hover:bg-white/30 text-white rounded-xl">
                    Réessayer le quiz
                  </Button>
                </CardContent>
              </Card>
            )}

            {!loading && !error && resultMessage && (
              <Card className="glass-card border-2 border-purple-400/25 shadow-2xl relative overflow-hidden">
                
                <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

                <CardHeader className="text-center pb-2">
                  <div className="inline-flex items-center justify-center p-2.5 bg-purple-500/20 rounded-full mb-3 border border-purple-400/20">
                    <Sparkles className="text-purple-300" size={24} />
                  </div>
                  <CardTitle className="text-white text-2xl">Rien que pour toi</CardTitle>
                  <CardDescription className="text-white/80">
                    Voici la petite pensée positive que nous avons sélectionnée :
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-2">
                  <div className="bg-white/10 border border-white/15 rounded-2xl p-6 relative">
                    <Heart className="absolute top-2 left-3 text-pink-400/10" size={48} fill="currentColor" />
                    <p className="text-white text-lg md:text-xl font-medium italic leading-relaxed text-center relative z-10">
                      "{resultMessage}"
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      onClick={copyToClipboard}
                      className="flex-1 bg-white/20 hover:bg-white/35 text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 border border-white/10"
                    >
                      {copied ? (
                        <>
                          <Check size={18} className="text-green-300" />
                          <span>Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          <span>Copier le message</span>
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={handleReset}
                      className="flex-1 btn-primary py-3 rounded-xl flex items-center justify-center space-x-2"
                    >
                      <RotateCcw size={18} />
                      <span>Refaire le quiz</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
