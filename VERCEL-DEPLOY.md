# 🚀 DÉPLOIEMENT SUR VERCEL

## 1️⃣ PRÉPARER LE PROJET

1. **Vérifie que tout est commité**
   ```bash
   git status
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

## 2️⃣ CRÉER UN COMPTE VERCEL

1. **Sign up**
   - https://vercel.com
   - "Continue with GitHub" (recommandé)

## 3️⃣ IMPORTER LE PROJET

1. **Dashboard Vercel**
   - Click "Add New..." → "Project"

2. **Import Git Repository**
   - Sélectionne : AtlasCoreUs/Sid
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: ./ 
   Build Command: npm run build
   Output Directory: (leave default)
   Install Command: npm install
   ```

## 4️⃣ VARIABLES D'ENVIRONNEMENT

**IMPORTANT** : Ajoute TOUTES ces variables dans Vercel !

1. **Dans Project Settings → Environment Variables**

2. **Ajoute une par une :**

```env
# Base
NODE_ENV=production
NEXTAUTH_URL=https://ton-domaine.vercel.app

# Secrets (générer avec: openssl rand -base64 32)
NEXTAUTH_SECRET=xxx

# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://... (si Supabase)

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

# GitHub OAuth (optionnel)
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID=price_xxx

# OpenAI
OPENAI_API_KEY=sk-xxx

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@ton-domaine.com

# SMS (Twilio - optionnel)
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+xxx
```

## 5️⃣ DÉPLOYER

1. **Click "Deploy"**
   - Première fois : ~3-5 minutes

2. **Vérifier le build**
   - Check les logs
   - Résoudre les erreurs si besoin

## 6️⃣ DOMAINE PERSONNALISÉ

1. **Settings → Domains**
   - Add : `ton-domaine.com`
   - Add : `www.ton-domaine.com`

2. **Chez ton registrar (OVH, etc.)**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

## 7️⃣ POST-DÉPLOIEMENT

1. **Mettre à jour les URLs**
   - Google OAuth : Ajouter nouvelle URL
   - Stripe Webhook : Nouvelle URL
   - NEXTAUTH_URL dans Vercel

2. **Initialiser la DB**
   ```bash
   npx prisma db push
   ```

3. **Tester**
   - Création compte
   - OAuth login
   - Paiement Stripe
   - Création app

## 🚨 DEBUGGING

### Build failed
→ Check logs dans Vercel dashboard

### 500 errors
→ Vérifie les env variables

### DB connection failed
→ Whitelist Vercel IPs dans Supabase

## 🎯 OPTIMISATIONS

1. **Analytics**
   - Enable Vercel Analytics
   - Enable Speed Insights

2. **Monitoring**
   - Setup Sentry
   - Configure alerts

3. **Performance**
   - Enable ISR
   - Configure cache headers

---

## ✅ CHECKLIST FINALE

- [ ] Toutes les env vars configurées
- [ ] Build passe sans erreur
- [ ] OAuth fonctionne
- [ ] Stripe webhooks reçus
- [ ] DB accessible
- [ ] Emails envoyés
- [ ] PWA installable

---

*Dernière mise à jour : [DATE]*