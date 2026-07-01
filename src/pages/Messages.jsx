import React, { useState, useEffect } from 'react';
import { MessageSquare, LogOut, Calendar, Gamepad2, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Messages = () => {
  // --- ÉTATS (STATES) ---
  const [usernameInput, setUsernameInput] = useState(''); // Pour stocker ce que l'utilisateur tape dans le formulaire de connexion
  const [currentUsername, setCurrentUsername] = useState(''); // Le pseudo de l'utilisateur actuellement connecté
  const [messages, setMessages] = useState([]); // Liste des messages reçus
  const [score, setScore] = useState(0); // Score du mode Gaming
  
  // États techniques pour gérer l'affichage UI
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [messagesError, setMessagesError] = useState('');

  // --- EFFETS (EFFECTS) ---
  // Au premier chargement de la page, on vérifie si un pseudo et un score sont déjà enregistrés dans le navigateur
  useEffect(() => {
    const savedUsername = localStorage.getItem('anonymots_username');
    const savedScore = localStorage.getItem('anonymots_score');
    
    if (savedUsername) {
      setCurrentUsername(savedUsername);
    }
    if (savedScore) {
      setScore(parseInt(savedScore, 10));
    }
  }, []);

  // Dès que currentUsername change (connexion ou reconnexion), on charge ses messages
  useEffect(() => {
    if (currentUsername) {
      fetchMessages(currentUsername);
    }
  }, [currentUsername]);

  // --- ACTIONS (FONCTIONS) ---

  // Charger les messages depuis le backend
  const fetchMessages = async (username) => {
    setLoading(true);
    setMessagesError('');
    try {
      const response = await fetch(`/api/messages/${username}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setMessagesError("Impossible de charger tes messages.");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des messages:", err);
      setMessagesError("Erreur réseau. Vérifie que le serveur est bien démarré.");
    } finally {
      setLoading(false);
    }
  };

  // Gérer la connexion de l'utilisateur
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setLoading(true);
    setLoginError('');

    const cleanUsername = usernameInput.trim().toLowerCase();

    try {
      // Étape 1 : On vérifie si le pseudo existe en base de données
      const response = await fetch(`/api/users/${cleanUsername}`);
      
      if (response.ok) {
        const user = await response.json();
        // Étape 2 : Si l'utilisateur existe, on met à jour nos états et localStorage
        localStorage.setItem('anonymots_username', user.username);
        setCurrentUsername(user.username);
      } else {
        // Si le statut est 404, l'utilisateur n'existe pas
        if (response.status === 404) {
          setLoginError("Ce pseudo n'existe pas encore. Crée ton lien sur la page d'accueil !");
        } else {
          setLoginError("Une erreur est survenue lors de la vérification.");
        }
      }
    } catch (err) {
      console.error("Erreur connexion:", err);
      setLoginError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  // Gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('anonymots_username');
    setCurrentUsername('');
    setMessages([]);
    setUsernameInput('');
  };

  // Gérer la résolution d'un indice (Gaming Mode)
  const handleGuess = async (messageId) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/guess`, {
        method: 'PUT',
      });

      if (response.ok) {
        const data = await response.json();
        
        // 1. Mettre à jour l'état local du message pour refléter qu'il est deviné
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === messageId ? { ...msg, is_guessed: 1 } : msg
          )
        );

        // 2. Mettre à jour et sauvegarder le score (+10 points)
        const newScore = score + data.points;
        setScore(newScore);
        localStorage.setItem('anonymots_score', newScore.toString());
      }
    } catch (err) {
      console.error("Erreur lors de la résolution de l'indice:", err);
    }
  };

  // --- RENDU (JSX) ---

  // ÉCRAN 1 : Si l'utilisateur n'est pas encore identifié
  if (!currentUsername) {
    return (
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-md mx-auto">
          <Card className="glass-card border-2 border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-blue-300" size={32} />
              </div>
              <CardTitle className="text-2xl text-white">Consulter mes messages</CardTitle>
              <CardDescription className="text-white/80">
                Saisis ton pseudo pour voir les messages anonymes reçus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Ton pseudo (ex: marie_2024)"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  className="bg-white/20 border-white/30 text-white placeholder-white/60 text-lg py-3 px-4 rounded-xl"
                  disabled={loading}
                />
                
                {loginError && (
                  <p className="text-red-300 text-sm font-medium bg-red-950/30 p-3 rounded-lg border border-red-500/20">
                    ⚠️ {loginError}
                  </p>
                )}

                <Button 
                  type="submit"
                  className="btn-primary w-full text-lg py-3 rounded-xl"
                  disabled={!usernameInput.trim() || loading}
                >
                  {loading ? "⏳ Vérification..." : "📬 Accéder à ma boîte"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ÉCRAN 2 : Si l'utilisateur est identifié et connecté
  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      
      {/* Barre d'infos utilisateur en haut */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center border border-pink-400/30">
            <span className="text-xl">🌸</span>
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">Boîte de {currentUsername}</h2>
            <p className="text-white/70 text-sm">Prêt(e) à recevoir de la bienveillance</p>
          </div>
        </div>

        {/* Section Score Gaming */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-purple-500/20 border border-purple-400/30 rounded-xl px-4 py-2">
            <Award className="text-purple-300" size={20} />
            <span className="text-white font-bold">{score} pts</span>
          </div>

          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full flex items-center space-x-2"
          >
            <LogOut size={16} />
            <span>Se déconnecter</span>
          </Button>
        </div>
      </div>

      {/* Zone de chargement / erreur de messages */}
      <div className="max-w-4xl mx-auto">
        {loading && messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white text-xl">⏳ Chargement de tes mots doux...</p>
          </div>
        )}

        {messagesError && (
          <div className="text-center py-8 bg-red-950/30 border border-red-500/20 rounded-xl p-4 max-w-md mx-auto">
            <ShieldAlert className="text-red-400 mx-auto mb-2" size={32} />
            <p className="text-red-300 font-medium">{messagesError}</p>
            <Button onClick={() => fetchMessages(currentUsername)} className="mt-4 bg-white/20 hover:bg-white/30 text-white">
              Réessayer
            </Button>
          </div>
        )}

        {/* Écran si aucun message n'a encore été reçu */}
        {!loading && !messagesError && messages.length === 0 && (
          <Card className="glass-card text-center py-12 max-w-xl mx-auto border-2 border-white/15">
            <CardContent className="space-y-6">
              <div className="text-5xl">💌</div>
              <CardTitle className="text-white text-2xl">Boîte vide pour le moment</CardTitle>
              <p className="text-white/70">
                Tu n'as pas encore reçu de message anonyme. Partage ton lien à tes proches pour en recevoir !
              </p>
              <div className="p-3 bg-white/15 rounded-lg text-white text-sm break-all font-mono">
                {`${window.location.origin}/send/${currentUsername}`}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des messages reçus */}
        {!loading && messages.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {messages.map((msg) => (
              <Card key={msg.id} className="glass-card hover:translate-y-[-2px] transition-all duration-300 border border-white/10 flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center text-white/50 text-xs">
                    <span className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{new Date(msg.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                    <span className="bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase">
                      Anonyme
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 flex-1">
                  {/* Contenu principal du message */}
                  <p className="text-white text-lg leading-relaxed italic font-medium">
                    "{msg.content}"
                  </p>

                  {/* Mode Gaming - Affichage des indices */}
                  {msg.has_clue === 1 && (
                    <div className="bg-purple-950/40 border border-purple-500/20 rounded-xl p-3.5 space-y-2 mt-4">
                      <div className="flex items-center space-x-2 text-purple-300 text-xs font-semibold uppercase tracking-wider">
                        <Gamepad2 size={14} />
                        <span>Mode Gaming : Indice laissé</span>
                      </div>
                      
                      <p className="text-white/90 text-sm bg-purple-900/20 p-2 rounded border border-purple-500/10">
                        🔍 {msg.clue}
                      </p>

                      {/* Gestion de la résolution du jeu */}
                      {msg.is_guessed === 1 ? (
                        <div className="flex items-center space-x-1.5 text-green-300 text-xs font-semibold pt-1">
                          <Sparkles size={12} />
                          <span>Deviné avec succès ! (+10 pts)</span>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleGuess(msg.id)}
                          size="sm"
                          className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                        >
                          🎯 J'ai deviné qui c'est !
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
