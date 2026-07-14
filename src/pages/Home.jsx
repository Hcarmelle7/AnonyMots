import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Share2, MessageCircle, Smile, HelpCircle, Copy, Check, Sparkles, Users, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Home = () => {
  const [username, setUsername] = useState('');
  const [userLink, setUserLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Creation du lien utilisateur en appelant l'API backend
  const generateUserLink = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setUserLink('');

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username }),
      });

      const data = await response.json();

      if (response.ok) {
        // Enregistrement du lien absolu vers la page SendMessage du destinataire
        const frontendLink = `${window.location.origin}/send/${data.username}`;
        setUserLink(frontendLink);
        // Connexion automatique en sauvegardant le pseudo localement
        localStorage.setItem('anonymots_username', data.username);
      } else {
        if (response.status === 409) {
          setError("Ce pseudo est déjà pris. Choisis-en un autre !");
        } else {
          setError(data.error || "Une erreur est survenue lors de la création.");
        }
      }
    } catch (err) {
      console.error('Erreur creation utilisateur:', err);
      setError("Impossible de joindre le serveur. Vérifie qu'il est bien démarré.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(userLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur copie presse-papiers:', err);
    }
  };

  const shareToSocial = (platform) => {
    const text = `Envoyez-moi un message anonyme sur AnonyMots ! ${userLink}`;
    const encodedText = encodeURIComponent(text);

    const urls = {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      instagram: `https://www.instagram.com/`,
      snapchat: `https://www.snapchat.com/`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(userLink)}`
    };

    window.open(urls[platform], '_blank');
  };

  return (
    <div className="min-h-screen relative z-10">

      {/* Presentation principale */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Bienvenue sur
            <span className="block bg-gradient-to-r from-pink-300 to-blue-300 bg-clip-text text-transparent">
              AnonyMots
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed">
            Un espace bienveillant pour partager et recevoir des messages anonymes.
            Exprimez vos pensées en toute sécurité et encouragez vos proches.
          </p>

          <div className="flex justify-center items-center space-x-8 mb-12 text-white/80">
            <div className="flex items-center space-x-2">
              <Shield size={20} />
              <span>100% Anonyme</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={20} />
              <span>Communauté Bienveillante</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles size={20} />
              <span>Messages Personnalisés</span>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de creation du lien personnel */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto" id="create-link-card">
          <Card className="glass-card border-2 border-white/20 shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-white mb-2">
                Créez votre lien personnel
              </CardTitle>
              <CardDescription className="text-white/85 text-lg">
                Choisissez un pseudo unique et partagez votre lien
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Votre pseudo (ex: marie_2024)"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  className="bg-white/20 border-white/30 text-white placeholder-white/60 text-lg py-3 px-4 rounded-xl"
                  disabled={loading}
                />

                {error && (
                  <p className="text-red-300 text-sm font-medium mt-1 bg-red-950/30 p-2 rounded-lg border border-red-500/20">
                    {error}
                  </p>
                )}

                <Button
                  onClick={generateUserLink}
                  className="btn-primary w-full text-lg py-3 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-95"
                  disabled={!username.trim() || loading}
                >
                  {loading ? "Création de ton lien..." : "Générer mon lien"}
                </Button>
              </div>

              {userLink && (
                <div className="space-y-4 p-4 bg-white/10 rounded-xl border border-white/20">
                  <div className="flex items-center justify-between p-3 bg-white/20 rounded-lg">
                    <span className="text-white text-sm flex-1 break-all mr-2">{userLink}</span>
                    <Button
                      size="sm"
                      onClick={copyToClipboard}
                      className="bg-white/20 hover:bg-white/30 shrink-0"
                    >
                      {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-white/80 mb-3">Partagez sur vos réseaux sociaux :</p>
                    <div className="flex justify-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => shareToSocial('whatsapp')}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        WhatsApp
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => shareToSocial('twitter')}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Twitter
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => shareToSocial('facebook')}
                        className="bg-blue-700 hover:bg-blue-800 text-white"
                      >
                        Facebook
                      </Button>
                    </div>
                  </div>

                  {/* Bouton pour aller directement voir les messages recus */}
                  <div className="pt-2 border-t border-white/10 text-center">
                    <Link to="/messages" className="block w-full">
                      <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-transform hover:scale-[1.02]">
                        <span>Accéder directement à ma boîte</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Grille des fonctionnalites de l'application */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Découvrez toutes les fonctionnalités
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            AnonyMots offre bien plus que des messages anonymes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Boite de réception */}
          <Card className="glass-card hover:scale-105 transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                <MessageCircle className="text-blue-400" size={32} />
              </div>
              <CardTitle className="text-white text-xl">Messages Anonymes</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/80 mb-6 leading-relaxed">
                Recevez des messages sincères de vos proches sans connaître leur identité.
                Un espace sûr pour l'expression authentique.
              </p>
              <Link to="/messages">
                <Button className="btn-primary w-full transition-all duration-200 hover:scale-[1.02] active:scale-95">
                  Voir mes messages
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Citations bienveillantes */}
          <Card className="glass-card hover:scale-105 transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500/30 transition-colors">
                <Smile className="text-yellow-400" size={32} />
              </div>
              <CardTitle className="text-white text-xl">Messages Bienveillants</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/80 mb-6 leading-relaxed">
                Découvrez des messages d'encouragement, des citations inspirantes
                et des mots réconfortants pour illuminer votre journée.
              </p>
              <Link to="/wellness">
                <Button className="btn-primary w-full transition-all duration-200 hover:scale-[1.02] active:scale-95">
                  Découvrir
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quiz interactif */}
          <Card className="glass-card hover:scale-105 transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                <HelpCircle className="text-purple-400" size={32} />
              </div>
              <CardTitle className="text-white text-xl">Quiz Personnalisé</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/80 mb-6 leading-relaxed">
                Répondez à notre quiz pour recevoir des messages adaptés à votre
                humeur : motivation, réconfort, encouragement.
              </p>
              <Link to="/quiz">
                <Button className="btn-primary w-full transition-all duration-200 hover:scale-[1.02] active:scale-95">
                  Commencer le quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mode gaming descriptif */}
      <section className="container mx-auto px-4 py-16">
        <Card className="glass-card max-w-4xl mx-auto border-2 border-purple-400/30 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎮</span>
            </div>
            <CardTitle className="text-white text-3xl mb-4">Mode Gaming</CardTitle>
            <CardDescription className="text-white/85 text-lg max-w-2xl mx-auto leading-relaxed">
              Transformez vos messages en jeu ! Les expéditeurs peuvent laisser des indices
              subtils sur leur identité. Devinez qui vous a écrit et gagnez des points !
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl mb-2">🕵️</div>
                <h4 className="text-white font-semibold mb-2">Indices Subtils</h4>
                <p className="text-white/70 text-sm">Les expéditeurs laissent des indices créatifs</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="text-white font-semibold mb-2">Devinez l'Identité</h4>
                <p className="text-white/70 text-sm">Utilisez votre intuition pour découvrir qui c'est</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🏆</div>
                <h4 className="text-white font-semibold mb-2">Gagnez des Points</h4>
                <p className="text-white/70 text-sm">Accumulez des points à chaque bonne réponse</p>
              </div>
            </div>
            <Button
              onClick={() => {
                document.getElementById('create-link-card').scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => document.querySelector('input').focus(), 600);
              }}
              className="btn-primary text-lg px-8 py-3 transition-transform duration-200 active:scale-95"
            >
              Activer le mode Gaming
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Appel à l'action bas de page */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Rejoignez la communauté AnonyMots et découvrez la magie des messages anonymes bienveillants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="btn-primary text-lg px-8 py-3 transition-transform duration-200 active:scale-95"
              onClick={() => {
                document.getElementById('create-link-card').scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => document.querySelector('input').focus(), 600);
              }}
            >
              Créer mon lien maintenant
            </Button>
            <Link to="/wellness">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-lg px-8 py-3">
                Explorer les messages
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
