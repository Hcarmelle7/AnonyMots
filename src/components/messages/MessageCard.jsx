import React from 'react';
import { Calendar, Gamepad2, ChevronUp, ChevronDown, Sparkles, Send, Check, Copy, AlertTriangle, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';

/**
 * MessageCard : Affiche une carte pour un message anonyme individuel,
 * incluant la logique d'indice et de supposition pour le jeu de devinette.
 */
const MessageCard = ({
  msg,
  expandedGamingBlocks,
  setExpandedGamingBlocks,
  guessInputs,
  setGuessInputs,
  guessErrors,
  setGuessErrors,
  handleGuess,
  copiedReply,
  copyReply,
  setSharingMessage,
  setReplyText,
}) => {
  const getReplySuggestions = () => [
    `Wow Merci pour ce message, je n'aurais jamais deviné ! Merci d'avoir joué avec moi`,
    `Merci pour ta bienveillance, ça compte énormément pour moi`,
  ];

  return (
    <Card className="glass-card hover:translate-y-[-2px] transition-all duration-300 border border-white/10 flex flex-col justify-between">
      <CardHeader>
        <div className="flex justify-between items-center text-white/50 text-xs">
          <span className="flex items-center space-x-1">
            <Calendar size={12} />
            <span>
              {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </span>
          <span className="bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase">
            {msg.is_guessed === 1 && msg.sender_name ? msg.sender_name : 'Anonyme'}
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
                setExpandedGamingBlocks((prev) => ({
                  ...prev,
                  [msg.id]: !prev[msg.id],
                }));
              }}
              className="w-full flex items-center justify-between text-purple-300 hover:text-purple-200 text-xs font-semibold transition-colors focus:outline-none cursor-pointer text-left"
            >
              <div className="flex items-start space-x-2 flex-1 pr-2">
                <Gamepad2 size={14} className="mt-0.5 shrink-0" />
                <span className="leading-relaxed normal-case font-medium">
                  L'utilisateur vous a laissé des indices, essayez de deviner qui c'est.
                </span>
              </div>
              {expandedGamingBlocks[msg.id] ? (
                <ChevronUp size={14} className="shrink-0" />
              ) : (
                <ChevronDown size={14} className="shrink-0" />
              )}
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
                            <div
                              key={idx}
                              className="flex items-start gap-2 bg-white/5 rounded-lg p-2 border border-white/5 hover:border-blue-400/30 transition-colors group"
                            >
                              <p className="text-white/80 text-xs flex-1 leading-relaxed italic">
                                "{suggestion}"
                              </p>
                              <button
                                onClick={() => copyReply(suggestion, key)}
                                className="text-white/40 group-hover:text-blue-300 transition-colors flex-shrink-0 p-1"
                                title="Copier cette suggestion"
                              >
                                {copiedReply === key ? (
                                  <Check size={13} className="text-green-300" />
                                ) : (
                                  <Copy size={13} />
                                )}
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
                          setGuessInputs((prev) => ({ ...prev, [msg.id]: e.target.value }));
                          if (guessErrors[msg.id]) setGuessErrors((prev) => ({ ...prev, [msg.id]: '' }));
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
  );
};

export default MessageCard;
