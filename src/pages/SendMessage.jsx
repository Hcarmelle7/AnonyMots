import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, GamepadIcon, Heart, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';

const SendMessage = () => {
  const { username } = useParams();
  
  // --- ÉTATS (STATES) ---
  const [message, setMessage] = useState('');
  const [includeClue, setIncludeClue] = useState(false);
  const [clue, setClue] = useState('');
  const [sent, setSent] = useState(false);
  
  // Nouveaux états ergonomiques
  const [checkingUser, setCheckingUser] = useState(true); // Pour savoir si on vérifie l'existence du pseudo
  const [recipientExists, setRecipientExists] = useState(false); // Vrai si le pseudo est enregistré en base
  const [sending, setSending] = useState(false); // Pour désactiver le bouton pendant l'envoi
  const [errorMsg, setErrorMsg] = useState(''); // Pour stocker les messages d'erreur à l'envoi

  // --- EFFETS (EFFECTS) ---
  // Vérifie si le destinataire existe en base au chargement de la page
  useEffect(() => {
    const verifyUser = async () => {
      setCheckingUser(true);
      setErrorMsg('');
      try {
        const response = await fetch(`/api/users/${username.toLowerCase()}`);
        if (response.ok) {
          setRecipientExists(true);
        } else {
          setRecipientExists(false);
        }
      } catch (err) {
        console.error("Erreur vérification destinataire:", err);
        // Si le serveur est injoignable, on préfère être prudent
        setRecipientExists(false);
        setErrorMsg("Impossible de joindre le serveur pour valider ce pseudo.");
      } finally {
        setCheckingUser(false);
      }
    };

    if (username) {
      verifyUser();
    }
  }, [username]);

  // --- ACTIONS ---
  const sendMessage = async () => {
    if (!message.trim()) return;

    setSending(true);
    setErrorMsg('');
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: username,
          content: message,
          hasClue: includeClue,
          clue: includeClue ? clue : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSent(true);
        setMessage('');
        setClue('');
        setIncludeClue(false);
      } else {
        setErrorMsg(data.error || "Une erreur est survenue lors de l'envoi.");
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setErrorMsg("Erreur réseau. Vérifie que le serveur est démarré.");
    } finally {
      setSending(false);
    }
  };

  // --- RENDU (JSX) ---

  // ÉCRAN 1 : Chargement (vérification du pseudo en base)
  if (checkingUser) {
    return (
      <div className="container mx-auto px-4 py-16 relative z-10 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="text-white animate-spin mb-4" size={48} />
        <p className="text-white text-xl">Vérification de l'utilisateur en cours...</p>
      </div>
    );
  }

  // ÉCRAN 2 : Le destinataire n'existe pas en base de données
  if (!recipientExists) {
    return (
      <div className="container mx-auto px-4 py-16 relative z-10">
        <Card className="glass-card max-w-lg mx-auto text-center border-2 border-red-500/20">
          <CardHeader>
            <AlertCircle className="text-red-300 mx-auto mb-4" size={64} />
            <CardTitle className="text-white text-2xl">Destinataire introuvable</CardTitle>
            <CardDescription className="text-white/80 text-lg">
              Le pseudo <strong className="text-pink-300">"{username}"</strong> n'est pas enregistré sur AnonyMots.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-white/70">
              Vérifie l'orthographe du lien ou demande à ton ami(e) de te renvoyer son pseudo correct !
            </p>
            <div className="space-y-3">
              <Link to="/">
                <Button className="btn-primary w-full text-lg py-3 rounded-xl">
                  🏠 Retourner à l'accueil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ÉCRAN 3 : Succès d'envoi du message
  if (sent) {
    return (
      <div className="container mx-auto px-4 py-16 relative z-10">
        <Card className="glass-card max-w-md mx-auto text-center border-2 border-white/20 shadow-2xl">
          <CardHeader>
            <Heart className="text-pink-500 mx-auto mb-4 animate-bounce" size={64} fill="currentColor" />
            <CardTitle className="text-white text-2xl">Message envoyé !</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/80 mb-6 text-lg">
              Votre message anonyme a été transmis à <strong className="text-pink-300">{username}</strong> avec succès.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => setSent(false)} 
                className="btn-primary w-full text-lg py-3 rounded-xl"
              >
                Envoyer un autre message
              </Button>
              <Link to="/">
                <Button variant="outline" className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 text-lg py-3 rounded-xl">
                  Créer mon propre lien
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ÉCRAN 4 : Formulaire d'envoi standard (L'utilisateur existe)
  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Envoyer un message à <span className="text-pink-200">{username}</span>
        </h1>
        <p className="text-xl text-white/90">
          Votre message sera complètement anonyme
        </p>
      </div>

      <Card className="glass-card max-w-2xl mx-auto border border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Votre message anonyme</CardTitle>
          <CardDescription className="text-white/80 text-base">
            Écrivez un message bienveillant, encourageant ou simplement amical
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            placeholder="Écrivez votre message ici..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            className="bg-white/20 border-white/30 text-white placeholder-white/60 min-h-36 text-lg p-4 rounded-xl"
            maxLength={500}
            disabled={sending}
          />
          
          <div className="text-right text-white/60 text-sm font-medium">
            {message.length}/500 caractères
          </div>

          {/* Mode Gaming */}
          <div className="border-t border-white/15 pt-6 space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="gaming-mode"
                checked={includeClue}
                onCheckedChange={(checked) => {
                  setIncludeClue(checked);
                  if (!checked) setClue(''); // Réinitialise l'indice si décoché
                }}
                className="border-white/40 h-5 w-5 rounded-md"
                disabled={sending}
              />
              <label htmlFor="gaming-mode" className="text-white text-lg flex items-center space-x-2 cursor-pointer select-none">
                <GamepadIcon size={20} className="text-purple-300" />
                <span>Mode Gaming - Laisser un indice</span>
              </label>
            </div>
            
            {includeClue && (
              <div className="space-y-2 animate-fadeIn">
                <Textarea
                  placeholder="Laissez un indice subtil sur votre identité (ex: On s'est vu mardi...)"
                  value={clue}
                  onChange={(e) => setClue(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-white/60 p-3 rounded-xl text-base"
                  maxLength={100}
                  disabled={sending}
                />
                <p className="text-white/60 text-sm">
                  💡 L'indice permettra au destinataire de deviner qui vous êtes et de gagner des points !
                </p>
              </div>
            )}
          </div>

          {/* Affichage des erreurs à la soumission */}
          {errorMsg && (
            <p className="text-red-300 text-sm font-medium bg-red-950/30 p-3 rounded-lg border border-red-500/20">
              ⚠️ {errorMsg}
            </p>
          )}

          <Button
            onClick={sendMessage}
            disabled={!message.trim() || sending}
            className="btn-primary w-full text-lg py-3.5 rounded-xl flex items-center justify-center space-x-2"
          >
            {sending ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Envoyer le message</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Suggestion de création de lien */}
      <Card className="glass-card max-w-2xl mx-auto mt-8 border border-white/10">
        <CardContent className="text-center py-6">
          <p className="text-white/80 mb-4 text-base">
            Vous aussi, créez votre lien personnel pour recevoir des messages anonymes !
          </p>
          <Link to="/">
            <Button className="btn-primary font-semibold">
              ✨ Créer mon lien AnonyMots
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default SendMessage;

