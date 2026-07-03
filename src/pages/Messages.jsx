import React, { useState, useEffect } from 'react';
import { MessageSquare, LogOut, Calendar, Gamepad2, Award, ShieldAlert, Sparkles, Copy, Check, Send, AlertTriangle, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import AdSense from '../components/AdSense';

const Messages = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [score, setScore] = useState(0);
  
  const [guessInputs, setGuessInputs] = useState({});
  const [guessErrors, setGuessErrors] = useState({});
  const [copiedReply, setCopiedReply] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [messagesError, setMessagesError] = useState('');

  // Restauration des donnees utilisateur enregistrees localement au chargement
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

  // Chargement des messages dès que l'utilisateur est identifie
  useEffect(() => {
    if (currentUsername) {
      fetchMessages(currentUsername);
    }
  }, [currentUsername]);

  const fetchMessages = async (username) => {
    setLoading(true);
    setMessagesError('');
    try {
      const response = await fetch(`/api/messages/${username}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setMessagesError("Impossible de récupérer les messages.");
      }
    } catch (err) {
      console.error("Erreur chargement messages:", err);
      setMessagesError("Erreur réseau. Vérifie que le serveur est bien démarré.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setLoading(true);
    setLoginError('');

    const cleanUsername = usernameInput.trim().toLowerCase();

    try {
      const response = await fetch(`/api/users/${cleanUsername}`);
      
      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('anonymots_username', user.username);
        setCurrentUsername(user.username);
      } else {
        if (response.status === 404) {
          setLoginError("Ce pseudo n'existe pas. Créez-le sur la page d'accueil !");
        } else {
          setLoginError("Une erreur est survenue lors de la connexion.");
        }
      }
    } catch (err) {
      console.error("Erreur authentification:", err);
      setLoginError("Impossible de se connecter au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('anonymots_username');
    setCurrentUsername('');
    setMessages([]);
    setUsernameInput('');
  };

  // Soumission de la tentative de devinette au serveur
  const handleGuess = async (messageId) => {
    const guess = (guessInputs[messageId] || '').trim();
    if (!guess) return;

    setGuessErrors(prev => ({ ...prev, [messageId]: '' }));

    try {
      const response = await fetch(`/api/messages/${messageId}/guess`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === messageId ? { ...msg, is_guessed: 1, sender_name: data.senderName } : msg
          )
        );
        const newScore = score + data.points;
        setScore(newScore);
        localStorage.setItem('anonymots_score', newScore.toString());
        setGuessInputs(prev => ({ ...prev, [messageId]: '' }));
      } else {
        setGuessErrors(prev => ({ ...prev, [messageId]: data.message || 'Ce n\'est pas la bonne personne.' }));
      }
    } catch (err) {
      console.error("Erreur validation devinette:", err);
      setGuessErrors(prev => ({ ...prev, [messageId]: 'Erreur reseau. Reessaie.' }));
    }
  };

  const copyReply = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedReply(key);
      setTimeout(() => setCopiedReply(null), 2500);
    } catch (err) {
      console.error('Erreur copie suggestion:', err);
    }
  };

  const getReplySuggestions = () => [
    `Merci pour ce message, ça m'a vraiment touché(e) !`,
    `Wow, je n'aurais jamais deviné ! Merci d'avoir joué avec moi`,
    `C'était toi ! Je suis tellement content(e) que tu m'aies écrit ça`,
    `Merci pour ta bienveillance, ça compte énormément pour moi`,
  ];

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
                Saisissez votre pseudo pour voir les messages anonymes reçus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Votre pseudo (ex: marie_2024)"
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
                    {loginError}
                  </p>
                )}

                <Button 
                  type="submit"
                  className="btn-primary w-full text-lg py-3 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-95"
                  disabled={!usernameInput.trim() || loading}
                >
                  {loading ? "Vérification..." : "Accéder à ma boîte"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      
      {/* En-tete d'informations utilisateur */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center border border-pink-400/30">
            <Heart className="text-pink-400" size={24} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">Boîte de {currentUsername}</h2>
            <p className="text-white/70 text-sm">Prêt(e) à recevoir de la bienveillance</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-purple-500/20 border border-purple-400/30 rounded-xl px-4 py-2">
            <Award className="text-purple-300" size={20} />
            <span className="text-white font-bold">{score} pts</span>
          </div>

          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full flex items-center space-x-2 transition-all duration-200 hover:scale-[1.01] active:scale-95"
          >
            <LogOut size={16} />
            <span>Se déconnecter</span>
          </Button>
        </div>
      </div>

      {/* Publicité en ligne visible immédiatement */}
      <AdSense adSlot="9988776655" className="max-w-4xl mx-auto mb-6" />

      <div className="max-w-4xl mx-auto">
        {loading && messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white text-xl">Récupération de vos messages...</p>
          </div>
        )}

        {messagesError && (
          <div className="text-center py-8 bg-red-950/30 border border-red-500/20 rounded-xl p-4 max-w-md mx-auto">
            <ShieldAlert className="text-red-400 mx-auto mb-2" size={32} />
            <p className="text-red-300 font-medium">{messagesError}</p>
            <Button onClick={() => fetchMessages(currentUsername)} className="mt-4 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 active:scale-95">
              Réessayer
            </Button>
          </div>
        )}

        {/* Message d'absence de courriers */}
        {!loading && !messagesError && messages.length === 0 && (
          <Card className="glass-card text-center py-12 max-w-xl mx-auto border-2 border-white/15">
            <CardContent className="space-y-6">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-white/60" size={32} />
              </div>
              <CardTitle className="text-white text-2xl">Boîte vide pour le moment</CardTitle>
              <p className="text-white/70">
                Vous n'avez pas encore reçu de message. Partagez votre lien pour en recevoir !
              </p>
              <div className="p-3 bg-white/15 rounded-lg text-white text-sm break-all font-mono">
                {`${window.location.origin}/send/${currentUsername}`}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des courriers recensés */}
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
                      {msg.is_guessed === 1 && msg.sender_name ? msg.sender_name : "Anonyme"}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 flex-1">
                  <p className="text-white text-lg leading-relaxed italic font-medium">
                    "{msg.content}"
                  </p>

                  {/* Bloc Gaming Mode pour deviner l'expéditeur */}
                  {msg.has_clue === 1 && (
                    <div className="bg-purple-950/40 border border-purple-500/20 rounded-xl p-3.5 space-y-3 mt-4">
                      <div className="flex items-center space-x-2 text-purple-300 text-xs font-semibold uppercase tracking-wider">
                        <Gamepad2 size={14} />
                        <span>Mode Gaming</span>
                      </div>

                      {msg.clue && (
                        <p className="text-white/90 text-sm bg-purple-900/20 p-2.5 rounded-lg border border-purple-500/10">
                          Indice : {msg.clue}
                        </p>
                      )}

                      {msg.is_guessed === 1 ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-1.5 text-green-300 text-sm font-semibold bg-green-950/30 px-3 py-2 rounded-lg border border-green-500/20">
                            <Sparkles size={14} className="animate-pulse" />
                            <span>Bravo ! Prénom trouvé ! +10 pts</span>
                          </div>

                          <div className="bg-blue-950/30 border border-blue-400/20 rounded-xl p-3 space-y-2.5">
                            <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5">
                              <Send size={12} />
                              <span>Et si vous lui répondiez ?</span>
                            </p>
                            <p className="text-white/65 text-xs leading-relaxed">
                              Vous pouvez lui envoyer un mot en retour. Voici des idées prêtes à copier :
                            </p>
                            <div className="space-y-1.5">
                              {getReplySuggestions().map((suggestion, idx) => {
                                const key = `${msg.id}-reply-${idx}`;
                                return (
                                  <div key={idx} className="flex items-start gap-2 bg-white/5 rounded-lg p-2 border border-white/5 hover:border-blue-400/30 transition-colors group">
                                    <p className="text-white/80 text-xs flex-1 leading-relaxed italic">"{suggestion}"</p>
                                    <button
                                      onClick={() => copyReply(suggestion, key)}
                                      className="text-white/40 group-hover:text-blue-300 transition-colors flex-shrink-0 p-1"
                                      title="Copier cette suggestion"
                                    >
                                      {copiedReply === key
                                        ? <Check size={13} className="text-green-300" />
                                        : <Copy size={13} />}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                            <p className="text-white/35 text-[10px] text-center pt-0.5">
                              Copiez une suggestion pour lui envoyer sur son propre lien.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-white/70 text-xs font-medium">
                            Qui vous a écrit ? Saisissez son prénom :
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Son prénom..."
                              value={guessInputs[msg.id] || ''}
                              onChange={(e) => {
                                setGuessInputs(prev => ({ ...prev, [msg.id]: e.target.value }));
                                if (guessErrors[msg.id]) setGuessErrors(prev => ({ ...prev, [msg.id]: '' }));
                              }}
                              onKeyDown={(e) => e.key === 'Enter' && handleGuess(msg.id)}
                              className="flex-1 bg-white/10 border border-purple-400/30 text-white placeholder-white/40 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-purple-400/70"
                              maxLength={50}
                            />
                            <button
                              onClick={() => handleGuess(msg.id)}
                              disabled={!(guessInputs[msg.id] || '').trim()}
                              className="bg-purple-600 hover:bg-purple-500 active:scale-95 disabled:opacity-40 disabled:scale-100 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer"
                            >
                              Valider
                            </button>
                          </div>
                          {guessErrors[msg.id] && (
                            <p className="text-red-300 text-xs font-medium flex items-center space-x-1">
                              <AlertTriangle size={12} className="shrink-0" />
                              <span>{guessErrors[msg.id]}</span>
                            </p>
                          )}
                        </div>
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
