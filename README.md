
# J'ai Lu Les CGU (Enfin, presque...)

L'application qui traduit le charabia juridique des Conditions Générales d'Utilisation (CGU) en langage que vous pouvez enfin comprendre. Fini de signer des pactes avec le diable numérique sans le savoir !

## 🧐 Pourquoi ce projet ?

Nous cliquons tous sur "J'accepte" sans jamais lire les kilomètres de jargon juridique. Ces textes sont conçus pour être opaques et décourageants. **"J'ai Lu Les CGU"** est un outil satirique et éducatif qui vise à démystifier ces documents en les reformulant avec différents tons, pour que vous sachiez enfin à quoi vous vous engagez.

C'est un projet de [DevEnGalère](https://www.linkedin.com/in/yvesnarsonkevine) pour mettre en lumière l'absurdité de certaines clauses et redonner un peu de pouvoir aux utilisateurs.

## ✨ Fonctionnalités

- **Collage de Texte Facile** : Une zone de texte simple pour y déposer n'importe quel extrait de CGU, politique de confidentialité ou autre document rébarbatif.
- **Traduction Multi-Tons** : Choisissez comment vous voulez que le texte soit "traduit" :
  - **Simple** : Une explication claire, directe et sans fioritures, comme si un ami vous expliquait les points importants.
  - **Sarcastique** : Une version cynique et humoristique qui souligne les clauses abusives et les formulations absurdes.
  - **Développeur** : Une reformulation truffée d'analogies techniques (API, dette technique, open source, etc.) pour les geeks.
  - **Essentiel** : Une version simplifiée et détaillée des points essentiels du texte.

- **Interface Épurée et Responsive** : Une expérience utilisateur agréable sur ordinateur comme sur mobile.
- **Copie Facile** : Un bouton pour copier la traduction et la partager facilement.
- **Utilisation de l'IA de Google** : Propulsé par le modèle `gemini-2.5-flash` pour des reformulations rapides et pertinentes.

## Technologies Utilisées

- **React** : Une bibliothèque JavaScript pour construire l'interface utilisateur.
- **Vite** : Un outil de build moderne et rapide pour les projets front-end.
- **TypeScript** : Un superset de JavaScript qui ajoute le typage statique.
- **Google Gemini API** : L'intelligence artificielle de Google, utilisée pour la reformulation du texte.
- **`@google/generative-ai`** : La bibliothèque officielle pour interagir avec l'API Gemini.

## 🚀 Comment ça marche ?

1.  L'utilisateur colle le texte juridique dans le champ prévu.
2.  Il choisit l'un des quatres tons de reformulation (Simple, Sarcastique, Développeur,Essentiel & Risques).
3.  En cliquant sur le bouton "Déchiffrer", l'application envoie le texte à l'API Gemini de Google.
4.  Une `systemInstruction` spécifique au ton choisi est ajoutée à la requête pour guider le modèle d'IA.
5.  Le modèle `gemini-2.5-flash` analyse le texte et le reformule selon l'instruction.
6.  La réponse est affichée dans le panneau de droite.

### Prérequis

  - Node.js (version 18 ou supérieure recommandée)
  - Un compte et une clé API pour l'API Google Gemini.

## ⚙️ Installation et Lancement Local


1.  Clonez le dépôt :
    ```bash
    git clone https://github.com/votre-utilisateur/votre-repo.git
    cd votre-repo
    ```
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  Créez un fichier `.env` à la racine de votre projet et ajoutez votre clé API :
    ```
    VITE_API_KEY=votre_clé_api_ici
    ```
    > **Note :** Le préfixe `VITE_` est nécessaire pour que la variable soit accessible dans votre projet React avec Vite.
    - Même si ici je n'ai ne me suis pas casé la tête (pardon )

4.  Démarrez le serveur de développement :
    ```bash
    npm run dev
    ```
Le projet sera accessible sur `http://localhost:5173`.

-----
  ***Configuration de la Clé API*** :
    Ce projet nécessite une clé API pour le service Google Gemini.
    -   Obtenez votre clé API sur [Google AI Studio](https://aistudio.google.com/app/apikey).
    -   L'application est codée pour récupérer la clé depuis une variable d'environnement `process.env.API_KEY`. Pour un test local simple, vous pouvez remplacer `process.env.API_KEY!` dans le fichier `services/geminiService.ts` par votre clé en dur (pensez à ne **jamais** la commiter !).
    
## ⚠️ Avertissement

Cette application est un outil satirique et éducatif. **Les textes générés ne constituent en aucun cas un conseil juridique.** Le but est de simplifier et de critiquer, pas de fournir une analyse légale fiable. Ne prenez aucune décision importante sur la base des reformulations fournies. En cas de doute, consultez un vrai avocat (un qui ne soit pas un robot sarcastique).

---

### Fonctionnalités à venir

Nous prévoyons d'améliorer cette application avec les fonctionnalités suivantes :

- **Support des fichiers** : La possibilité de télécharger des documents **PDF** et des **images** pour en extraire le texte et le reformuler.
- **Historique des reformulations** : Sauvegarder vos textes reformulés pour les réutiliser plus tard.
- **Personnalisation avancée** : Des options pour définir un ton personnalisé au-delà des choix prédéfinis.
- **Interface utilisateur améliorée** : Une refonte du design pour une meilleure expérience utilisateur.

---

### Explication

L'ajout de ces fonctionnalités montre que le projet est vivant et en cours d'amélioration. La section "Fonctionnalités à venir" est une excellente façon de susciter l'intérêt et de montrer la direction que prend le projet.
## Auteur

Fait avec ❤️, beaucoup de café et une dose de cynisme par **[DevEnGalère](https://www.linkedin.com/in/yvesnarsonkevine)**.

## Licence

Ce projet est sous licence MIT.
