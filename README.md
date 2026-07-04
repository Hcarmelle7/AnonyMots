# AnonyMots 💖 — Le Frontend (Application React)

Coucou ! Bienvenue dans la partie visible d'AnonyMots. C'est l'application web avec laquelle les utilisateurs interagissent directement pour s'envoyer des mots doux. 

J'ai mis beaucoup de soin à concevoir une interface qui soit à la fois simple, colorée et réconfortante. J'ai choisi des tons doux, des dégradés apaisants et des petits cœurs qui flottent en arrière-plan pour créer un espace où on se sent bien et en sécurité.

---

## 🎯 Ce qu'on trouve sur cette application

* **L'Accueil** : C'est ici que tout commence ! On peut y créer son pseudo ou se connecter si on a déjà un compte.
* **La Boîte de Réception (`/messages`)** : L'endroit où on peut lire tous ses messages reçus. Si l'expéditeur a activé le **Mode Gaming**, on a accès à un indice et à une zone de texte pour tenter de deviner son prénom (et gagner des points !).
* **La Page d'Envoi (`/send/:username`)** : Une page dédiée pour écrire à quelqu'un, avec ou sans indice.
* **L'Espace Bien-être (`/wellness`)** : Si on a besoin d'un petit coup de boost, on peut venir y piocher des citations positives triées sur le volet.
* **Le Quiz d'Humeur (`/quiz`)** : Un court questionnaire pour exprimer son état d'esprit actuel (stress, tristesse, fatigue...). En retour, l'appli propose un message chaleureux et des conseils personnalisés pour se remonter le moral.

---

## 🛠️ Ma boîte à outils technique

Pour développer cette application, j'ai utilisé des technos modernes et super rapides :
* **React 18** avec **Vite** (pour avoir un environnement de dev instantané et fluide).
* **Tailwind CSS** + du CSS sur-mesure pour les animations de cœurs et le style de verre dépoli (*glassmorphism*).
* **shadcn/ui** (pour des boutons et cartes propres et bien finis).
* **Lucide React** (pour toutes les petites icônes sympa).
* **React Router DOM** (pour naviguer entre les différentes pages de manière invisible).

---

## 🚀 Comment lancer le projet en local ?

### 1. Installation
Assure-toi d'être dans le dossier `anonymous-messages-app` puis installe les paquets :
```bash
npm install
# ou pnpm install si tu l'as d'installé globalement
```

### 2. Démarrage
Lance le serveur de développement local :
```bash
npm run dev
```
Par défaut, le site sera disponible sur `http://localhost:5173/`. 

*Note : N'oublie pas de lancer le serveur backend en parallèle pour que les fonctionnalités de connexion et d'envoi de messages fonctionnent correctement !*

---

## 📂 Organisation du code

Voici comment j'ai structuré mes dossiers :
* `src/components/` : Contient mes éléments réutilisables comme le `Header`, le tout nouveau `Footer`, l'arrière-plan de cœurs `FloatingHearts` ou encore l'espace pub `AdSense`.
* `src/pages/` : Les pages principales du site (Accueil, Messages, Envoi, Bien-être et Quiz).
* `src/App.jsx` : Le chef d'orchestre qui configure nos différentes routes et applique le design global.

---

Merci d'avoir pris le temps de regarder mon travail ! Si tu as des suggestions ou des idées pour rendre l'appli encore plus chaleureuse, n'hésite pas à m'en faire part. ✨

*Rose Carmelle*
