import React from 'react';

interface Template {
  id: string;
  name: string;
  icon: string;
  category: string;
  content: string;
  tags: string[];
}

interface NoteTemplatesProps {
  onSelectTemplate: (template: Template) => void;
  isDarkMode: boolean;
}

export function NoteTemplates({ onSelectTemplate, isDarkMode }: NoteTemplatesProps) {
  const templates: Template[] = [
    {
      id: 'meeting',
      name: 'Réunion',
      icon: '👥',
      category: 'Projets',
      content: `# Réunion - [Date]

## Participants
- 
- 

## Ordre du jour
1. 
2. 
3. 

## Notes
### Point 1


### Point 2


### Point 3


## Actions à suivre
- [ ] 
- [ ] 
- [ ] 

## Prochaine réunion
Date : 
Heure : 
Lieu : `,
      tags: ['réunion', 'travail']
    },
    {
      id: 'daily',
      name: 'Journal quotidien',
      icon: '📅',
      category: 'Général',
      content: `# Journal - ${new Date().toLocaleDateString()}

## 🌅 Objectifs du jour
- [ ] 
- [ ] 
- [ ] 

## 📝 Notes et réflexions


## 🎯 Accomplissements


## 🤔 Défis rencontrés


## 💡 Idées pour demain


## 🙏 Gratitude
Je suis reconnaissant(e) pour :
- 
- 
- `,
      tags: ['journal', 'personnel']
    },
    {
      id: 'project',
      name: 'Nouveau projet',
      icon: '🚀',
      category: 'Projets',
      content: `# Projet : [Nom du projet]

## 📋 Description


## 🎯 Objectifs
1. 
2. 
3. 

## 👥 Équipe
- **Chef de projet** : 
- **Membres** :
  - 
  - 

## 📅 Timeline
- **Début** : 
- **Fin prévue** : 
- **Jalons** :
  - [ ] Phase 1 : 
  - [ ] Phase 2 : 
  - [ ] Phase 3 : 

## 📊 Budget


## 🚧 Risques identifiés
1. 
2. 

## 📝 Notes supplémentaires
`,
      tags: ['projet', 'planification']
    },
    {
      id: 'brainstorm',
      name: 'Brainstorming',
      icon: '💡',
      category: 'Idées',
      content: `# Brainstorming : [Sujet]

## 🎯 Objectif


## 💭 Idées principales
### Idée 1
- 

### Idée 2
- 

### Idée 3
- 

## 🔗 Connexions et associations


## ✨ Idées innovantes


## 📋 Prochaines étapes
1. 
2. 
3. 

## 📚 Ressources à consulter
- 
- `,
      tags: ['idées', 'brainstorming']
    },
    {
      id: 'review',
      name: 'Revue hebdomadaire',
      icon: '📊',
      category: 'TODO',
      content: `# Revue hebdomadaire - Semaine du ${new Date().toLocaleDateString()}

## ✅ Accomplissements
- 
- 
- 

## 📈 Progrès sur les objectifs
### Objectif 1 : 
Progrès : ⬜⬜⬜⬜⬜ 0%

### Objectif 2 : 
Progrès : ⬜⬜⬜⬜⬜ 0%

## 🚧 Obstacles rencontrés
- 
- 

## 📚 Apprentissages
- 
- 

## 📅 Priorités pour la semaine prochaine
1. 
2. 
3. 

## 💭 Réflexions personnelles
`,
      tags: ['revue', 'hebdomadaire', 'todo']
    },
    {
      id: 'bug',
      name: 'Rapport de bug',
      icon: '🐛',
      category: 'Urgent',
      content: `# Bug Report - [Titre du bug]

## 🔴 Sévérité
[ ] Critique
[ ] Majeur
[ ] Mineur
[ ] Cosmétique

## 📝 Description


## 🔄 Étapes pour reproduire
1. 
2. 
3. 

## ✅ Comportement attendu


## ❌ Comportement actuel


## 🖼️ Captures d'écran


## 🔧 Environnement
- **OS** : 
- **Navigateur** : 
- **Version** : 

## 📋 Logs / Messages d'erreur
\`\`\`

\`\`\`

## 💡 Solution proposée
`,
      tags: ['bug', 'urgent', 'technique']
    },
    {
      id: 'recipe',
      name: 'Recette',
      icon: '🍳',
      category: 'Général',
      content: `# Recette : [Nom du plat]

## 🥘 Type de plat
- **Catégorie** : 
- **Temps de préparation** : 
- **Temps de cuisson** : 
- **Portions** : 

## 🛒 Ingrédients
- 
- 
- 
- 

## 📝 Instructions
1. 
2. 
3. 
4. 
5. 

## 💡 Astuces
- 
- 

## 🍷 Accompagnements suggérés


## 📸 Photo du plat
`,
      tags: ['recette', 'cuisine', 'personnel']
    },
    {
      id: 'book',
      name: 'Note de lecture',
      icon: '📚',
      category: 'Général',
      content: `# 📖 [Titre du livre]

## 📝 Informations
- **Auteur** : 
- **Genre** : 
- **Date de lecture** : 
- **Note** : ⭐⭐⭐⭐⭐

## 🎯 Résumé


## 💭 Citations marquantes
> 
> 

> 
> 

## 💡 Idées clés
1. 
2. 
3. 

## 🤔 Réflexions personnelles


## 🔗 Liens avec d'autres lectures


## 📚 Lectures recommandées suite à ce livre
- 
- `,
      tags: ['lecture', 'livre', 'apprentissage']
    }
  ];

  return (
    <div className="templates-section">
      <h3>📋 Templates de notes</h3>
      <div className="templates-grid">
        {templates.map(template => (
          <div
            key={template.id}
            className="template-card"
            onClick={() => onSelectTemplate(template)}
          >
            <div className="template-icon">{template.icon}</div>
            <div className="template-name">{template.name}</div>
            <div className="template-description">
              Catégorie : {template.category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}