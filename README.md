Veuillez consulter le fichier Documentation Jiro pour la documentation plus detaillée du projet ainsi qu'un démo courte des principales fonctionnalités. 

## Démo : https://jiro-ikram-annabelle.web.app/

```markdown
# JIRO - Application de Gestion de Projet

JIRO est une application de gestion de projet conçue pour aider les équipes à organiser, planifier et collaborer efficacement. En combinant des fonctionnalités telles que la création de tableaux, la gestion des tâches et la personnalisation des thèmes, JIRO offre une plateforme intuitive et puissante pour améliorer la productivité des équipes.



## Fonctionnalités

- Création et gestion de tableaux de projet
- Ajout et gestion de colonnes et de cartes
- Personnalisation des thèmes et des avatars
- Gestion des utilisateurs avec Firebase Authentication
- Notifications en temps réel
- Responsive design pour une utilisation sur tous les appareils

## Technologies Utilisées

- **Frontend**: React.js, React Router, Context API, CSS, Bootstrap
- **Backend et Services**: Firebase, Firebase Firestore, Firebase Authentication
- **Outils de Développement**: Node.js, npm, Webpack, Babel, ESLint
- **Tests**: Jest
- **Hébergement et Déploiement**: Firebase Hosting, GitHub

## Installation et Configuration

### Prérequis

- Node.js et npm installés
- Compte Firebase avec un projet configuré

### Installation

1. Clonez le dépôt :
   ```sh
   git clone https://github.com/votre-utilisateur/jiro.git
   cd jiro
   ```

2. Installez les dépendances :
   ```sh
   npm install
   ```

### Configuration Initiale

1. Créez un fichier `.env` à la racine du projet et ajoutez vos configurations Firebase :
   ```env
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

2. Démarrez l'application :
   ```sh
   npm start
   ```

### Déploiement

1. Construisez l'application pour la production :
   ```sh
   npm run build
   ```

2. Déployez sur Firebase Hosting :
   ```sh
   firebase deploy
   ```

## Utilisation

### Inscription et Connexion

1. Ouvrez l'application JIRO dans votre navigateur.
2. Inscrivez-vous ou connectez-vous avec votre compte.

### Création et Gestion des Projets

1. Une fois connecté, vous pouvez créer un nouveau projet en cliquant sur "Create Board".
2. Ajoutez des colonnes et des cartes à votre tableau pour organiser vos tâches.

### Personnalisation des Thèmes et Avatars

1. Accédez à la page des paramètres.
2. Choisissez un thème parmi les options disponibles.
3. Sélectionnez un avatar à partir de la liste pour personnaliser votre profil.

## Tests

Pour exécuter les tests unitaires et d'intégration, utilisez la commande suivante :
```sh
npm test
```

Les tests sont situés dans le répertoire `src/tests`.

## Contribuer

Les contributions sont les bienvenues ! Pour commencer :

1. Forkez le dépôt.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`).
3. Commitez vos changements (`git commit -m 'Ajoute ma fonctionnalité'`).
4. Poussez votre branche (`git push origin feature/ma-fonctionnalite`).
5. Ouvrez une Pull Request.

