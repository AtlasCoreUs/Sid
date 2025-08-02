# SID HUD – Moanna Style

> Une interface HUD de type barre latérale qui s'étend au survol, se rétracte quand inactif, supporte les modes sombre/clair, les notes à onglets, l'auto-sauvegarde et les options d'export.

## ✨ Fonctionnalités

- **Barre latérale intelligente** : S'étend au survol (400px), se rétracte à 20px quand inactif
- **Mode sombre/clair** : Basculement fluide entre les thèmes
- **Notes à onglets** : Gestion de multiples notes avec interface intuitive
- **Auto-sauvegarde** : Sauvegarde automatique dans le localStorage
- **Export flexible** : Export en formats TXT, MD et complet avec métadonnées
- **Interface responsive** : Adaptation mobile et desktop
- **Animations fluides** : Transitions et micro-interactions
- **Support clavier** : Raccourcis et navigation au clavier

## 🚀 Installation

```bash
# Cloner le repository
git clone <repository-url>
cd sid-hud

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

## 🛠️ Scripts disponibles

```bash
npm run dev      # Lancer le serveur de développement
npm run build    # Construire pour la production
npm run start    # Lancer le serveur de production
npm run lint     # Vérifier le code avec ESLint
```

## 🎯 Utilisation

### Interface principale
- **Survol** : La barre latérale s'étend automatiquement
- **Inactivité** : Se rétracte après 2 secondes d'inactivité
- **Thème** : Cliquez sur l'icône soleil/lune pour changer de thème

### Gestion des notes
- **Nouvelle note** : Cliquez sur le bouton "+" 
- **Édition titre** : Double-clic sur le titre d'un onglet
- **Suppression** : Cliquez sur l'icône 🗑️
- **Navigation** : Cliquez sur un onglet pour l'activer

### Édition
- **Auto-sauvegarde** : Sauvegarde automatique après 1 seconde d'inactivité
- **Indentation** : Utilisez la touche Tab pour indenter
- **Statistiques** : Compteur de mots et caractères en temps réel

### Export
- **TXT** : Export simple en format texte
- **MD** : Export en format Markdown
- **Complet** : Export avec métadonnées (dates de création/modification)

## 🎨 Personnalisation

### Variables CSS
```css
:root {
  --sidebar-width: 400px;
  --sidebar-collapsed-width: 20px;
  --dark-bg: #0f172a;
  --light-bg: #ffffff;
  --primary-color: #3b82f6;
  /* ... */
}
```

### Thèmes
Le projet utilise des variables CSS pour une personnalisation facile des couleurs et dimensions.

## 📱 Responsive Design

- **Desktop** : Barre latérale de 400px
- **Mobile** : Barre latérale pleine largeur
- **Tablette** : Adaptation automatique

## 🔧 Technologies utilisées

- **Next.js 14** : Framework React
- **TypeScript** : Typage statique
- **CSS Modules** : Styles modulaires
- **localStorage** : Persistance des données
- **Montserrat** : Police principale

## 📁 Structure du projet

```
src/
├── components/          # Composants React
│   ├── Sidebar.tsx     # Barre latérale principale
│   ├── Tab.tsx         # Composant d'onglet
│   ├── NoteEditor.tsx  # Éditeur de notes
│   ├── ThemeToggle.tsx # Bascule de thème
│   ├── ExportButton.tsx # Bouton d'export
│   └── *.module.css    # Styles des composants
├── pages/              # Pages Next.js
│   └── index.tsx       # Page principale
└── styles/             # Styles globaux
    └── globals.css     # CSS global
```

## 🚀 Déploiement

### Vercel (recommandé)
```bash
npm run build
# Déployer sur Vercel
```

### Autres plateformes
Le projet est compatible avec toutes les plateformes supportant Next.js.

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- Design inspiré par les interfaces HUD modernes
- Police Montserrat de Google Fonts
- Icônes emoji pour une interface intuitive
