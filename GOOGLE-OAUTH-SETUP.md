# 🔐 CONFIGURATION GOOGLE OAUTH POUR SID HUD

## 1️⃣ CRÉER UN PROJET GOOGLE CLOUD

1. **Va sur Google Cloud Console**
   - https://console.cloud.google.com

2. **Créer un nouveau projet**
   ```
   Project name: SID HUD
   Project ID: sid-hud (ou auto-généré)
   ```

3. **Activer les APIs nécessaires**
   - Va dans "APIs & Services" → "Enable APIs"
   - Recherche et active : "Google+ API"

## 2️⃣ CONFIGURER L'ÉCRAN DE CONSENTEMENT

1. **APIs & Services → OAuth consent screen**

2. **Configuration**
   ```
   User Type: External
   
   App information:
   - App name: SID HUD
   - User support email: [ton email]
   - App logo: [upload logo]
   
   App domain:
   - Application home page: https://ton-domaine.com
   - Privacy policy: https://ton-domaine.com/privacy
   - Terms of service: https://ton-domaine.com/terms
   
   Developer contact: [ton email]
   ```

3. **Scopes**
   - Ajoute : email, profile, openid

## 3️⃣ CRÉER LES CREDENTIALS

1. **APIs & Services → Credentials**
   - Click "+ CREATE CREDENTIALS"
   - Choose "OAuth client ID"

2. **Configuration OAuth**
   ```
   Application type: Web application
   Name: SID HUD Web Client
   
   Authorized JavaScript origins:
   - http://localhost:3000 (dev)
   - https://ton-domaine.com (prod)
   
   Authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google (dev)
   - https://ton-domaine.com/api/auth/callback/google (prod)
   ```

3. **Récupère les clés**
   ```
   Client ID: xxx.apps.googleusercontent.com
   Client secret: GOCSPX-xxx
   ```

## 4️⃣ VARIABLES D'ENVIRONNEMENT

```env
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
```

## 🚨 IMPORTANT PRODUCTION

Pour passer en production :
1. Soumettre l'app pour vérification Google
2. Ajouter les conditions d'utilisation
3. Ajouter la politique de confidentialité

---

*Dernière mise à jour : [DATE]*