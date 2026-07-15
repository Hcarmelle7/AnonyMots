import React, { useState, useEffect } from 'react';
import { MessageSquare, LogOut, Award, ShieldAlert, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import AdSense from '../components/AdSense';
import MessageCard from '../components/messages/MessageCard';
import ShareModal from '../components/messages/ShareModal';

/**
 * Messages : Page principale de consultation des messages reçus.
 * Gère l'authentification locale, le score global et les appels API.
 */
const Messages = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [score, setScore] = useState(0);

  const [guessInputs, setGuessInputs] = useState({});
  const [guessErrors, setGuessErrors] = useState({});
  const [copiedReply, setCopiedReply] = useState(null);
  const [expandedGamingBlocks, setExpandedGamingBlocks] = useState({});

  const [sharingMessage, setSharingMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [messagesError, setMessagesError] = useState('');

  // Restauration des données utilisateur enregistrées localement au chargement
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

  // Chargement des messages dès que l'utilisateur est identifié
  useEffect(() => {
    if (currentUsername) {
      fetchMessages(currentUsername);
    }
  }, [currentUsername]);

  const fetchMessages = async (username) => {
    setLoading(true);
    setMessagesError('');
    try {
      const response = await fetch(`/api/messages/${username}`, {
        headers: { 'X-User-Auth': username }
      });
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
        setLoginError(response.status === 404 ? "Ce pseudo n'existe pas." : "Erreur de connexion.");
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
      setGuessErrors(prev => ({ ...prev, [messageId]: 'Erreur réseau. Réessaie.' }));
    }
  };

  const copyReply = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedReply(key);
      setReplyText(text);
      setTimeout(() => setCopiedReply(null), 2500);
    } catch (err) {
      console.error('Erreur copie suggestion:', err);
    }
  };

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
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Votre pseudo"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-white/60 text-lg py-3 px-4 rounded-xl"
                  disabled={loading}
                />
                {loginError && <p className="text-red-300 text-sm">{loginError}</p>}
                <Button type="submit" className="btn-primary w-full" disabled={loading}>
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
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center border border-pink-400/30">
            <Heart className="text-pink-400" size={24} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">Boîte de {currentUsername}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/20 border border-purple-400/30 rounded-xl px-4 py-2 flex items-center gap-2">
            <Award className="text-purple-300" size={20} />
            <span className="text-white font-bold">{score} pts</span>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="text-white/80">
            <LogOut size={16} />
          </Button>
        </div>
      </div>

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

        {!loading && messages.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {messages.map((msg) => (
              <MessageCard
                key={msg.id}
                msg={msg}
                expandedGamingBlocks={expandedGamingBlocks}
                setExpandedGamingBlocks={setExpandedGamingBlocks}
                guessInputs={guessInputs}
                setGuessInputs={setGuessInputs}
                guessErrors={guessErrors}
                setGuessErrors={setGuessErrors}
                handleGuess={handleGuess}
                copiedReply={copiedReply}
                copyReply={copyReply}
                setSharingMessage={setSharingMessage}
                setReplyText={setReplyText}
              />
            ))}
          </div>
        )}
      </div>

      {sharingMessage && (
        <ShareModal
          sharingMessage={sharingMessage}
          setSharingMessage={setSharingMessage}
          currentUsername={currentUsername}
          replyText={replyText}
          setReplyText={setReplyText}
        />
      )}
    </div>
  );
};

export default Messages;
