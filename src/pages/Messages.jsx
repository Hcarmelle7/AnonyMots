import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, LogOut, Calendar, Gamepad2, Award, ShieldAlert, Sparkles, Copy, Check, Send, AlertTriangle, Heart, ChevronDown, ChevronUp, Share2, Download, Link2, X, Palette } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import AdSense from '../components/AdSense';

// ==========================================
// THÈMES DE COULEURS POUR LES CARTES DE PARTAGE (20 THÈMES PREMIUM)
// Vous pouvez cliquer sur le bouton palette de la prévisualisation pour en changer.
// ==========================================
const CARD_THEMES = [
  // Favoris initiaux (très agréables et lumineux)
  { name: 'Ciel & Rose ', colors: ['#87CEEB', '#DDA0DD', '#FFB6C1'], isLight: false },
  { name: 'Crépuscule d\'Or ', colors: ['#FF5E62', '#FF9966', '#FFD97D'], isLight: false },

  // 1. Dégradés Sombres / Mystiques
  { name: 'Nuit Pourpre ', colors: ['#12072B', '#090317', '#020005'], isLight: false },
  { name: 'Abysse Bleue ', colors: ['#0A192F', '#020C1B', '#00040A'], isLight: false },
  { name: 'Obsidienne ', colors: ['#1A1A1A', '#0D0D0D', '#000000'], isLight: false },
  { name: 'Vortex Néon ', colors: ['#2E0854', '#1A0033', '#0A0015'], isLight: false },
  { name: 'Forêt Sombre ', colors: ['#0A1F13', '#030D07', '#000000'], isLight: false },

  // 2. Dégradés Colorés & Vibrants (Sombres)
  { name: 'Aurore Violette ', colors: ['#4A154B', '#2C0E37', '#12001B'], isLight: false },
  { name: 'Galaxie Rose ', colors: ['#6B114D', '#3F052D', '#1A0013'], isLight: false },
  { name: 'Cyberpunk', colors: ['#00F2FE', '#4FACFE', '#000000'], isLight: false },
  { name: 'Magma Flamboyant', colors: ['#833AB4', '#FD1D1D', '#FCB045'], isLight: false },
  { name: 'Canyon Orange', colors: ['#4E1C02', '#220800', '#000000'], isLight: false },

  // 3. Dégradés Lumineux / Clairs (isLight: true)
  { name: 'Rêve de Pêche ', colors: ['#FFEDD5', '#FED7AA', '#FDBA74'], isLight: true },
  { name: 'Menthe Fraîche', colors: ['#ECFDF5', '#D1FAE5', '#A7F3D0'], isLight: true },
  { name: 'Pastel Lilas ', colors: ['#F3E8FF', '#E9D5FF', '#D8B4FE'], isLight: true },
  { name: 'Ciel Matinal ', colors: ['#E0F2FE', '#BAE6FD', '#7DD3FC'], isLight: true },
  { name: 'Coquillage ', colors: ['#FFF7ED', '#FFE4E6', '#FECDD3'], isLight: true },
  { name: 'Sable d\'Or', colors: ['#FEF9C3', '#FEF08A', '#FDE047'], isLight: true },
  { name: 'Bulle de Gomme', colors: ['#FCE7F3', '#FBCFE8', '#F9A8D4'], isLight: true },
  { name: 'Brouillard Blanc ', colors: ['#F8FAFC', '#E2E8F0', '#CBD5E1'], isLight: true },
  { name: 'Thé Vert', colors: ['#F0FDF4', '#DCFCE7', '#BBF7D0'], isLight: true },
  { name: 'Lumière d\'Été ', colors: ['#FFFBEB', '#FEF3C7', '#FDE68A'], isLight: true }
];

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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Index du thème de couleur sélectionné pour le partage des messages
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);

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
      setReplyText(text);
      setTimeout(() => setCopiedReply(null), 2500);
    } catch (err) {
      console.error('Erreur copie suggestion:', err);
    }
  };

  // Génération dynamique de l'image de la carte (format 1:1 carré pour les Posts / Status)
  const generateCardImage = (content, username, reply, theme) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080; // Ratio 1:1 Carré (1080x1080)
      const ctx = canvas.getContext('2d');

      // 1. Fond Dégradé basé sur le thème
      const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
      gradient.addColorStop(0, theme.colors[0]);
      gradient.addColorStop(0.5, theme.colors[1]);
      gradient.addColorStop(1, theme.colors[2]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1080);

      // Cœurs décoratifs en arrière-plan (adaptés au format carré)
      ctx.fillStyle = theme.isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.15)';
      const drawHeart = (x, y, size) => {
        ctx.beginPath();
        ctx.moveTo(x, y + size / 4);
        ctx.quadraticCurveTo(x, y, x + size / 2, y);
        ctx.quadraticCurveTo(x + size, y, x + size, y + size / 3);
        ctx.quadraticCurveTo(x + size, y + size * 2 / 3, x + size / 2, y + size);
        ctx.quadraticCurveTo(x, y + size * 2 / 3, x, y + size / 3);
        ctx.quadraticCurveTo(x, y, x, y + size / 4);
        ctx.closePath();
        ctx.fill();
      };
      drawHeart(150, 180, 80);
      drawHeart(920, 240, 70);
      drawHeart(820, 780, 100);
      drawHeart(200, 850, 70);

      // Découpage automatique des lignes du message original
      const textX = 1080 / 2;
      const maxWidth = 760;
      const words = content.split(' ');
      let line = '';
      const lines = [];

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        ctx.font = 'italic 48px sans-serif';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      let fontSize = 48;
      let computedLineHeight = 68;
      if (lines.length > 5) {
        fontSize = 38;
        computedLineHeight = 54;
      }

      // Traitement et découpage de la réponse de l'utilisateur
      const replyLines = [];
      let replyHeight = 0;
      if (reply && reply.trim().length > 0) {
        const replyWords = reply.trim().split(' ');
        let replyLine = '';
        const replyMaxWidth = 720;

        for (let n = 0; n < replyWords.length; n++) {
          const testLine = replyLine + replyWords[n] + ' ';
          ctx.font = 'bold 36px sans-serif';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > replyMaxWidth && n > 0) {
            replyLines.push(replyLine);
            replyLine = replyWords[n] + ' ';
          } else {
            replyLine = testLine;
          }
        }
        replyLines.push(replyLine);
        replyHeight = replyLines.length * 52 + 70; // 52px hauteur de ligne + 70px padding
      }

      // 2. Hauteur de la carte centrale adaptée à la taille du message + réponse
      const textHeight = lines.length * computedLineHeight + (replyHeight > 0 ? replyHeight + 60 : 0);
      const cardPadding = 240; // Espace pour guillemets, marge et watermark
      const cardHeight = Math.min(650, Math.max(380, textHeight + cardPadding));

      const cardX = 90;
      const cardY = (1080 - cardHeight) / 2 - 40; // Centré avec léger décalage vers le haut
      const cardWidth = 900;
      const radius = 35;

      // Ombre de la carte
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 20;

      // Remplissage transparent de la carte (sombre ou clair)
      ctx.fillStyle = theme.isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(cardX, cardY, cardWidth, cardHeight, radius);
      } else {
        ctx.rect(cardX, cardY, cardWidth, cardHeight);
      }
      ctx.fill();

      // Bordure subtile
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = theme.isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Dessin de la bannière capsule chevauchant le haut de la carte
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      const topBadgeW = 520;
      const topBadgeH = 75;
      const topBadgeX = (1080 - topBadgeW) / 2;
      const topBadgeY = cardY - topBadgeH / 2;
      const topBadgeR = 37;

      ctx.fillStyle = theme.isLight ? '#1F0033' : '#FFFFFF';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(topBadgeX, topBadgeY, topBadgeW, topBadgeH, topBadgeR);
      } else {
        ctx.rect(topBadgeX, topBadgeY, topBadgeW, topBadgeH);
      }
      ctx.fill();

      // Texte de la bannière
      ctx.shadowColor = 'transparent';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = theme.isLight ? '#FFFFFF' : '#DDA0DD';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('POSE-MOI UNE QUESTION', 1080 / 2, topBadgeY + topBadgeH / 2);

      // 3. Dessin du message original (haut de la carte)
      ctx.fillStyle = theme.isLight ? '#1F0033' : '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `italic ${fontSize}px sans-serif`;

      const topHeight = cardHeight - (replyHeight > 0 ? replyHeight + 60 : 0);
      const textY = cardY + 110 + (topHeight - 150) / 2;

      let currentY = textY - ((lines.length - 1) * computedLineHeight) / 2;
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i].trim(), textX, currentY);
        currentY += computedLineHeight;
      }

      // 4. Dessin de la bulle de réponse (si présente)
      if (replyHeight > 0) {
        const replyW = 760;
        const replyX = (1080 - replyW) / 2;
        const replyY = cardY + cardHeight - replyHeight - 90;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 6;

        ctx.fillStyle = theme.isLight ? '#1F0033' : '#FFFFFF';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(replyX, replyY, replyW, replyHeight, 24);
        } else {
          ctx.rect(replyX, replyY, replyW, replyHeight);
        }
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillStyle = theme.isLight ? '#FFFFFF' : '#DDA0DD';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let currentReplyY = replyY + (replyHeight / 2) - ((replyLines.length - 1) * 52) / 2;
        for (let i = 0; i < replyLines.length; i++) {
          ctx.fillText(replyLines[i].trim(), 1080 / 2, currentReplyY);
          currentReplyY += 52;
        }
      }

      // Marque AnonyMots en bas de carte
      ctx.font = 'bold 28px sans-serif';
      ctx.fillStyle = theme.isLight ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('AnonyMots 💖', 1080 / 2, cardY + cardHeight - 65);

      // 5. Badge d'appel à l'action en dessous de la carte
      const badgeW = 760;
      const badgeH = 80;
      const badgeX = (1080 - badgeW) / 2;
      const badgeY = Math.min(970, cardY + cardHeight + 25);
      const badgeR = 40;

      ctx.fillStyle = theme.isLight ? '#1F0033' : '#FFFFFF';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, badgeR);
      } else {
        ctx.rect(badgeX, badgeY, badgeW, badgeH);
      }
      ctx.fill();

      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = theme.isLight ? '#FFFFFF' : '#DDA0DD';
      ctx.fillText(`Écris-moi sur : anonymots.com/send/${username}`, 1080 / 2, badgeY + badgeH / 2);

      resolve(canvas.toDataURL('image/png'));
    });
  };

  const handleShare = async (msg) => {
    try {
      const currentTheme = CARD_THEMES[selectedThemeIndex];
      const dataUrl = await generateCardImage(msg.content, currentUsername, replyText, currentTheme);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `anonymots-${msg.id}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Mon message AnonyMots 💖',
          text: `Regarde ce message anonyme reçu ! Écris-moi aussi sur : anonymots.com/send/${currentUsername}`,
        });
      } else if (navigator.share) {
        await navigator.share({
          title: 'AnonyMots',
          text: `Regarde mon message anonyme sur AnonyMots ! Écris-moi aussi : ${window.location.origin}/send/${currentUsername}`,
          url: `${window.location.origin}/send/${currentUsername}`
        });
      } else {
        // En cas de non-support, on copie le lien dans le presse-papier
        navigator.clipboard.writeText(`${window.location.origin}/send/${currentUsername}`);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (err) {
      console.error("Erreur de partage :", err);
    }
  };

  const handleDownload = async (msg) => {
    try {
      const currentTheme = CARD_THEMES[selectedThemeIndex];
      const dataUrl = await generateCardImage(msg.content, currentUsername, replyText, currentTheme);
      const link = document.createElement('a');
      link.download = `anonymots-${msg.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Erreur de téléchargement :", err);
    }
  };

  const getReplySuggestions = () => [
    `Wow Merci pour ce message, je n'aurais jamais deviné ! Merci d'avoir joué avec moi`,
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

        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center space-x-2 bg-purple-500/20 border border-purple-400/30 rounded-xl px-4 py-2">
            <Award className="text-purple-300" size={20} />
            <span className="text-white font-bold">{score} pts</span>
          </div>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full flex items-center space-x-2 transition-all duration-200 hover:scale-[1.01] active:scale-95 animate-fadeIn"
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
                <CardHeader className="">
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

                <CardContent className="space-y-2 flex-1">
                  <p className="text-white text-lg leading-relaxed italic font-medium">
                    "{msg.content}"
                  </p>

                  {/* Bloc Gaming Mode pour deviner l'expéditeur */}
                  {msg.has_clue === 1 && (
                    <div className="bg-purple-950/40 border border-purple-500/20 rounded-xl p-3.5 mt-4">
                      {/* En-tête cliquable pour plier/déplier */}
                      <button
                        onClick={() => {
                          setExpandedGamingBlocks(prev => ({
                            ...prev,
                            [msg.id]: !prev[msg.id]
                          }));
                        }}
                        className="w-full flex items-center justify-between text-purple-300 hover:text-purple-200 text-xs font-semibold transition-colors focus:outline-none cursor-pointer text-left"
                      >
                        <div className="flex items-start space-x-2 flex-1 pr-2">
                          <Gamepad2 size={14} className="mt-0.5 shrink-0" />
                          <span className="leading-relaxed normal-case font-medium">L'utilisateur vous a laissé des indices, essayez de deviner qui c'est.</span>
                        </div>
                        {expandedGamingBlocks[msg.id] ? <ChevronUp size={14} className="shrink-0" /> : <ChevronDown size={14} className="shrink-0" />}
                      </button>

                      {/* Contenu rétractable */}
                      {expandedGamingBlocks[msg.id] && (
                        <div className="space-y-3 pt-3 mt-3 border-t border-purple-500/20">
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
                                  Copiez une suggestion pour lui envoyer un message privé.
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
                    </div>
                  )}
                  {/* Bouton de Partage large et très visible */}
                  <Button
                    onClick={() => {
                      setSharingMessage(msg);
                      setReplyText(''); // Réinitialise le texte de réponse
                    }}
                    className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 active:scale-95 text-white font-bold py-2.5 rounded-xl shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Share2 size={15} />
                    <span>Répondre & Partager la carte</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de partage en forme de Story 9:16 */}
      {sharingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-white/15 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSharingMessage(null)}
              className="absolute top-3 right-3 text-white/50 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center">
              <h3 className="text-white font-bold text-lg">Partager la carte</h3>
              <p className="text-white/60 text-xs mt-1">
                Génère une carte pour ton status WhatsApp, Instagram ou Snapchat.
              </p>
            </div>

            {/* Aperçu en temps réel */}
            <div className="flex justify-center py-2 relative">
              <div
                className="w-[210px] h-[210px] rounded-xl overflow-hidden relative shadow-lg flex flex-col justify-between p-3.5 select-none text-center aspect-square transition-all duration-300"
                style={{ background: `linear-gradient(to bottom, ${CARD_THEMES[selectedThemeIndex].colors[0]}, ${CARD_THEMES[selectedThemeIndex].colors[1]}, ${CARD_THEMES[selectedThemeIndex].colors[2]})` }}
              >
                {/* Bouton discret pour changer le theme de la carte */}
                <button
                  onClick={() => setSelectedThemeIndex((prev) => (prev + 1) % CARD_THEMES.length)}
                  className={`absolute top-3 right-3 ${CARD_THEMES[selectedThemeIndex].isLight ? 'bg-black/20 hover:bg-black/30 border-black/25 text-black' : 'bg-white/20 hover:bg-white/30 border-white/25 text-white'} rounded-full p-1.5 border transition-all shadow-md active:scale-90 cursor-pointer z-30 flex items-center justify-center`}
                  title="Changer de thème"
                >
                  <Palette size={12} />
                </button>

                <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none">
                  {/* Cœurs décoratifs */}
                </div>

                <div className="relative z-10 w-full h-full flex flex-col justify-between">
                  <div className="flex-grow flex flex-col justify-center">
                    <div className={`border rounded-lg p-2 mx-0.5 shadow-sm backdrop-blur-[2px] flex flex-col justify-center relative min-h-[90px] ${CARD_THEMES[selectedThemeIndex].isLight
                      ? 'bg-black/5 border-black/10 text-slate-800'
                      : 'bg-white/20 border-white/30 text-white'
                      }`}>
                      {/* Bannière capsule chevauchant le haut */}
                      <div className={`absolute w-[130px] -top-3.5 left-1/2 transform -translate-x-1/2 text-[6px] font-bold py-1 px-3 rounded-full shadow-md tracking-wider whitespace-wrap z-20 ${CARD_THEMES[selectedThemeIndex].isLight
                        ? 'bg-slate-800 text-white'
                        : 'bg-white text-[#DDA0DD]'
                        }`}>
                        Avouez-moi tout. Anonymement, ou avec un petit indice !
                      </div>

                      {/* Guillemet décoratif */}
                      <span className={`text-2xl leading-none font-serif block ${CARD_THEMES[selectedThemeIndex].isLight ? 'text-black/15' : 'text-white/40'
                        }`}>“</span>

                      <p className="text-[9px] font-medium leading-relaxed italic line-clamp-4 items-center justify-center">
                        {sharingMessage.content}
                      </p>

                      {/* Aperçu de la réponse en direct */}
                      {replyText.trim() && (
                        <div className={`font-bold text-[8px] py-1.5 px-2 rounded-lg shadow-sm mt-2 animate-fadeIn text-center mx-1 break-words ${CARD_THEMES[selectedThemeIndex].isLight
                          ? 'bg-slate-800 text-white'
                          : 'bg-white text-[#DDA0DD]'
                          }`}>
                          {replyText}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`rounded-full py-1 px-2 mt-2 shadow-sm flex items-center justify-center ${CARD_THEMES[selectedThemeIndex].isLight ? 'bg-slate-800' : 'bg-white'
                    }`}>
                    <span className={`text-[7px] font-bold tracking-wide truncate max-w-full ${CARD_THEMES[selectedThemeIndex].isLight ? 'text-pink-300' : 'text-[#DDA0DD]'
                      }`}>
                      anonymots.com/send/{currentUsername}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Champ de saisie pour la réponse avant partage */}
            <div className="space-y-1.5 text-left">
              <label className="text-white/70 text-xs font-semibold">Votre réponse :</label>
              <input
                type="text"
                placeholder="Écrivez votre réponse ici (optionnel)..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/45 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all duration-200"
                maxLength={120}
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={async () => {
                  setIsGeneratingImage(true);
                  await handleShare(sharingMessage);
                  setIsGeneratingImage(false);
                }}
                disabled={isGeneratingImage}
                className="w-full bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-bold text-sm py-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2 shadow-md"
              >
                <Share2 size={16} />
                <span>{isGeneratingImage ? "Génération..." : "Partager directement"}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={async () => {
                    setIsGeneratingImage(true);
                    await handleDownload(sharingMessage);
                    setIsGeneratingImage(false);
                  }}
                  disabled={isGeneratingImage}
                  className="bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs py-2.5 rounded-xl transition-all duration-200 border border-white/10 cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Download size={14} />
                  <span>Télécharger</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/send/${currentUsername}`);
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                  }}
                  className="bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs py-2.5 rounded-xl transition-all duration-200 border border-white/10 cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Link2 size={14} />
                  <span>{copySuccess ? "Copié !" : "Copier le lien"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
