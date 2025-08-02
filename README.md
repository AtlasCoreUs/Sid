# 🚀 SID HUD – Interface de Notes Intelligente

> Une sidebar moderne qui s'active au survol pour une prise de notes efficace et intuitive

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-Latest-black.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Fonctionnalités Principales

### 📝 **Système de Notes Avancé**
- ✅ **Auto-sauvegarde** : Sauvegarde automatique après 1 seconde d'inactivité
- ✅ **Catégories intelligentes** : Organisez vos notes par thème (Général, Idées, TODO, Projets, Urgent)
- ✅ **Recherche puissante** : Recherche dans le titre, contenu et tags
- ✅ **Édition en temps réel** : Interface responsive avec mise à jour instantanée
- ✅ **Duplication rapide** : Dupliquez vos notes en un clic
- ✅ **Statistiques détaillées** : Compteur de mots, caractères et horodatage

### 🎯 **Interface Utilisateur**
- ✅ **Sidebar responsive** : S'ouvre au survol (20vw), se ferme automatiquement (20px)
- ✅ **Mode sombre/clair** : Thème adaptatif avec transition fluide
- ✅ **Animations modernes** : Transitions CSS fluides et micro-interactions
- ✅ **Design mobile-first** : Interface entièrement responsive
- ✅ **Notes récentes** : Accès rapide aux 5 dernières notes consultées

### ⌨️ **Raccourcis Clavier**
- `Ctrl+N` : Créer une nouvelle note
- `Ctrl+S` : Sauvegarder la note actuelle
- `Ctrl+E` : Exporter en Markdown
- `Ctrl+F` : Focus sur la barre de recherche
- `Escape` : Fermer les formulaires

### 📤 **Export Avancé**
- ✅ **Format TXT** : Export simple avec métadonnées
- ✅ **Format Markdown** : Export formaté avec en-têtes et structure
- ✅ **Export groupé** : Téléchargez toutes vos notes en un seul fichier
- ✅ **Noms de fichiers intelligents** : Génération automatique de noms sécurisés

## 🛠 Installation

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Installation rapide

```bash
# Cloner le repository
git clone https://github.com/votre-username/sid-hud.git
cd sid-hud

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### Build de production

```bash
# Build optimisé
npm run build

# Démarrer en production
npm start

# Export statique (optionnel)
npm run export
```

## 🎮 Utilisation

### Première utilisation

1. **Ouvrir la sidebar** : Survolez la barre latérale gauche (📝)
2. **Créer une note** : Cliquez sur ➕ ou utilisez `Ctrl+N`
3. **Écrire du contenu** : L'auto-sauvegarde se charge du reste !
4. **Organiser** : Utilisez les catégories et la recherche
5. **Exporter** : Boutons 📄 (TXT) et 📝 (Markdown)

### Fonctionnalités avancées

#### Gestion des catégories
- **5 catégories pré-définies** : Général, Idées, TODO, Projets, Urgent
- **Filtrage intelligent** : Sélectionnez "Toutes" pour voir l'ensemble
- **Badges colorés** : Identification visuelle rapide

#### Recherche et navigation
- **Recherche globale** : Titre, contenu et tags inclus
- **Notes récentes** : Les 3 dernières notes en accès rapide
- **Navigation clavier** : Support complet des raccourcis

#### Export et sauvegarde
- **Stockage local** : Données persistantes dans le navigateur
- **Formats multiples** : TXT pour simplicité, MD pour structure
- **Métadonnées complètes** : Date de création, modification, catégorie

## 🏗 Architecture Technique

### Stack technologique
- **Frontend** : Next.js 13+ avec TypeScript
- **Styling** : CSS3 avec variables CSS et animations
- **Stockage** : LocalStorage pour persistance côté client
- **Build** : Webpack via Next.js

### Structure du projet
```
src/
├── components/
│   ├── Sidebar.tsx          # Composant sidebar principal
│   ├── NotesManager.tsx     # Gestionnaire de notes
│   └── MainContent.tsx      # Contenu principal
├── pages/
│   ├── index.tsx           # Page d'accueil
│   └── _app.tsx            # Configuration app
└── styles/
    └── globals.css         # Styles globaux
```

### Fonctionnalités techniques

#### Auto-sauvegarde intelligente
```typescript
// Sauvegarde après 1 seconde d'inactivité
autoSaveTimeoutRef.current = setTimeout(() => {
  setNotes(prev => prev.map(note =>
    note.id === activeNoteId
      ? { ...note, content, updatedAt: new Date() }
      : note
  ));
}, 1000);
```

#### Gestion d'état optimisée
- **React Hooks** : useState, useEffect, useRef
- **Persistance locale** : Synchronisation automatique avec localStorage
- **Performance** : Debounce sur l'auto-sauvegarde, lazy loading

## 🎨 Personnalisation

### Thèmes
Le système de thèmes utilise des variables CSS pour une personnalisation facile :

```css
:root {
  --sidebar-width: 20vw;              /* Largeur sidebar ouverte */
  --sidebar-collapsed-width: 20px;    /* Largeur sidebar fermée */
  --accent: #3b82f6;                  /* Couleur principale */
  --dark-bg: #111827;                 /* Arrière-plan sombre */
  --light-bg: #f9fafb;               /* Arrière-plan clair */
}
```

### Responsive Design
- **Mobile** : Sidebar 80vw, interface adaptée
- **Tablet** : Sidebar 40vw, grille responsive
- **Desktop** : Sidebar 20vw, expérience complète

## 📊 Performances

### Optimisations intégrées
- ✅ **Lazy loading** : Chargement différé des composants
- ✅ **Debouncing** : Auto-sauvegarde optimisée
- ✅ **CSS optimisé** : Variables et animations GPU
- ✅ **Bundle splitting** : Code splitting automatique via Next.js

### Métriques typiques
- **First Paint** : < 1.5s
- **Interactive** : < 2.5s
- **Bundle size** : < 150KB gzipped

## 🔧 Configuration Avancée

### Variables d'environnement
Créez un fichier `.env.local` pour personnaliser :

```env
# Optionnel : configuration future
NEXT_PUBLIC_APP_NAME=SID HUD
NEXT_PUBLIC_VERSION=1.0.0
```

### Déploiement
Compatible avec toutes les plateformes modernes :

- **Vercel** : `vercel deploy`
- **Netlify** : `npm run build && npm run export`
- **GitHub Pages** : Configuration automatique disponible
- **Docker** : Dockerfile inclus

## 🚀 Roadmap

### Version 1.1 (À venir)
- [ ] **Synchronisation cloud** : Backup automatique
- [ ] **Tags personnalisés** : Système de tags étendu
- [ ] **Thèmes personnalisés** : Éditeur de thèmes intégré
- [ ] **Import/Export JSON** : Sauvegarde complète

### Version 1.2 (Futur)
- [ ] **Collaboration** : Partage de notes
- [ ] **Plugin system** : Extensions tierces
- [ ] **API REST** : Intégration externe
- [ ] **PWA** : Application mobile native

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment participer :

1. **Fork** le projet
2. **Créez** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commitez** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Standards de code
- **TypeScript** : Types stricts requis
- **ESLint** : Configuration fournie
- **Prettier** : Formatage automatique
- **Commits** : Convention Conventional Commits

## 📝 Licence

Distribué sous licence MIT. Voir `LICENSE` pour plus d'informations.

## 🙏 Remerciements

- **Next.js** team pour le framework
- **React** team pour la bibliothèque
- **Montserrat** pour la typographie
- **Communauté open source** pour l'inspiration

---

<div align="center">

**[🌟 Star ce projet](https://github.com/votre-username/sid-hud)** si vous l'avez trouvé utile !

Développé avec ❤️ pour une prise de notes optimale

</div>
