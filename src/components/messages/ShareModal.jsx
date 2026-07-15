import React, { useState } from 'react';
import { X, Palette, Share2, Download, Link2 } from 'lucide-react';

// ==========================================
// THÈMES DE COULEURS POUR LES CARTES DE PARTAGE (20 THÈMES PREMIUM)
// ==========================================
const CARD_THEMES = [
  { name: 'Ciel & Rose ', colors: ['#87CEEB', '#DDA0DD', '#FFB6C1'], isLight: false },
  { name: 'Crépuscule d\'Or ', colors: ['#FF5E62', '#FF9966', '#FFD97D'], isLight: false },
  { name: 'Nuit Pourpre ', colors: ['#12072B', '#090317', '#020005'], isLight: false },
  { name: 'Abysse Bleue ', colors: ['#0A192F', '#020C1B', '#00040A'], isLight: false },
  { name: 'Obsidienne ', colors: ['#1A1A1A', '#0D0D0D', '#000000'], isLight: false },
  { name: 'Vortex Néon ', colors: ['#2E0854', '#1A0033', '#0A0015'], isLight: false },
  { name: 'Forêt Sombre ', colors: ['#0A1F13', '#030D07', '#000000'], isLight: false },
  { name: 'Aurore Violette ', colors: ['#4A154B', '#2C0E37', '#12001B'], isLight: false },
  { name: 'Galaxie Rose ', colors: ['#6B114D', '#3F052D', '#1A0013'], isLight: false },
  { name: 'Cyberpunk', colors: ['#00F2FE', '#4FACFE', '#000000'], isLight: false },
  { name: 'Magma Flamboyant', colors: ['#833AB4', '#FD1D1D', '#FCB045'], isLight: false },
  { name: 'Canyon Orange', colors: ['#4E1C02', '#220800', '#000000'], isLight: false },
  { name: 'Rêve de Pêche ', colors: ['#FFEDD5', '#FED7AA', '#FDBA74'], isLight: true },
  { name: 'Menthe Fraîche', colors: ['#ECFDF5', '#D1FAE5', '#A7F3D0'], isLight: true },
  { name: 'Pastel Lilas ', colors: ['#F3E8FF', '#E9D5FF', '#D8B4FE'], isLight: true },
  { name: 'Ciel Matinal ', colors: ['#E0F2FE', '#BAE6FD', '#7DD3FC'], isLight: true },
  { name: 'Coquillage ', colors: ['#FFF7ED', '#FFE4E6', '#FECDD3'], isLight: true },
  { name: 'Sable d\'Or', colors: ['#FEF9C3', '#FEF08A', '#FDE047'], isLight: true },
  { name: 'Bulle de Gomme', colors: ['#FCE7F3', '#FBCFE8', '#F9A8D4'], isLight: true },
  { name: 'Brouillard Blanc ', colors: ['#F8FAFC', '#E2E8F0', '#CBD5E1'], isLight: true },
  { name: 'Thé Vert', colors: ['#F0FDF4', '#DCFCE7', '#BBF7D0'], isLight: true },
  { name: 'Lumière d\'Été ', colors: ['#FFFBEB', '#FEF3C7', '#FDE68A'], isLight: true },
];

/**
 * ShareModal : Affiche une modale permettant de configurer un message de réponse,
 * de choisir un thème visuel et de générer une carte image Canvas pour le partage.
 */
const ShareModal = ({
  sharingMessage,
  setSharingMessage,
  currentUsername,
  replyText,
  setReplyText,
}) => {
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

      // Rétablir l'ombre à transparent pour le texte
      ctx.shadowColor = 'transparent';

      // 3. Dessin des éléments intérieurs de la carte
      // Guillemet ouvrant
      ctx.font = 'bold 160px Georgia, serif';
      ctx.fillStyle = theme.isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.3)';
      ctx.textAlign = 'left';
      ctx.fillText('“', cardX + 50, cardY + 160);

      // Texte du message (Italique)
      ctx.font = `italic ${fontSize}px sans-serif`;
      ctx.fillStyle = theme.isLight ? '#1F0033' : '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let currentTextY = cardY + 140 + (fontSize === 38 ? 10 : 0);
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i].trim(), textX, currentTextY);
        currentTextY += computedLineHeight;
      }

      // Dessin de la Réponse si elle existe
      if (replyLines.length > 0) {
        const replyW = 780;
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
          url: `${window.location.origin}/send/${currentUsername}`,
        });
      } else {
        navigator.clipboard.writeText(`${window.location.origin}/send/${currentUsername}`);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (err) {
      console.error('Erreur de partage :', err);
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
      console.error('Erreur de téléchargement :', err);
    }
  };

  return (
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
            style={{
              background: `linear-gradient(to bottom, ${CARD_THEMES[selectedThemeIndex].colors[0]}, ${CARD_THEMES[selectedThemeIndex].colors[1]}, ${CARD_THEMES[selectedThemeIndex].colors[2]})`,
            }}
          >
            {/* Bouton discret pour changer le theme de la carte */}
            <button
              onClick={() => setSelectedThemeIndex((prev) => (prev + 1) % CARD_THEMES.length)}
              className={`absolute top-3 right-3 ${
                CARD_THEMES[selectedThemeIndex].isLight
                  ? 'bg-black/20 hover:bg-black/30 border-black/25 text-black'
                  : 'bg-white/20 hover:bg-white/30 border-white/25 text-white'
              } rounded-full p-1.5 border transition-all shadow-md active:scale-90 cursor-pointer z-30 flex items-center justify-center`}
              title="Changer de thème"
            >
              <Palette size={12} />
            </button>

            <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none">
              {/* Cœurs décoratifs */}
            </div>

            <div className="relative z-10 w-full h-full flex flex-col justify-between">
              <div className="flex-grow flex flex-col justify-center">
                <div
                  className={`border rounded-lg p-2 mx-0.5 shadow-sm backdrop-blur-[2px] flex flex-col justify-center relative min-h-[90px] ${
                    CARD_THEMES[selectedThemeIndex].isLight
                      ? 'bg-black/5 border-black/10 text-slate-800'
                      : 'bg-white/20 border-white/30 text-white'
                  }`}
                >
                  {/* Bannière capsule chevauchant le haut */}
                  <div
                    className={`absolute w-[130px] -top-3.5 left-1/2 transform -translate-x-1/2 text-[6px] font-bold py-1 px-3 rounded-full shadow-md tracking-wider whitespace-wrap z-20 ${
                      CARD_THEMES[selectedThemeIndex].isLight
                        ? 'bg-slate-800 text-white'
                        : 'bg-white text-[#DDA0DD]'
                    }`}
                  >
                    Avouez-moi tout. Anonymement, ou avec un petit indice !
                  </div>

                  {/* Guillemet décoratif */}
                  <span
                    className={`text-2xl leading-none font-serif block ${
                      CARD_THEMES[selectedThemeIndex].isLight ? 'text-black/15' : 'text-white/40'
                    }`}
                  >
                    “
                  </span>

                  <p className="text-[9px] font-medium leading-relaxed italic line-clamp-4 items-center justify-center">
                    {sharingMessage.content}
                  </p>

                  {/* Aperçu de la réponse en direct */}
                  {replyText.trim() && (
                    <div
                      className={`font-bold text-[8px] py-1.5 px-2 rounded-lg shadow-sm mt-2 animate-fadeIn text-center mx-1 break-words ${
                        CARD_THEMES[selectedThemeIndex].isLight
                          ? 'bg-slate-800 text-white'
                          : 'bg-white text-[#DDA0DD]'
                      }`}
                    >
                      {replyText}
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`rounded-full py-1 px-2 mt-2 shadow-sm flex items-center justify-center ${
                  CARD_THEMES[selectedThemeIndex].isLight ? 'bg-slate-800' : 'bg-white'
                }`}
              >
                <span
                  className={`text-[7px] font-bold tracking-wide truncate max-w-full ${
                    CARD_THEMES[selectedThemeIndex].isLight ? 'text-pink-300' : 'text-[#DDA0DD]'
                  }`}
                >
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
            <span>{isGeneratingImage ? 'Génération...' : 'Partager directement'}</span>
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
              <span>{copySuccess ? 'Copié !' : 'Copier le lien'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
