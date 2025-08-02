# 💳 GUIDE CONFIGURATION STRIPE POUR SID HUD

## 📋 PRÉREQUIS
- Compte Stripe vérifié
- Informations bancaires
- Logo de ton business

## 🚀 ÉTAPES DE CONFIGURATION

### 1️⃣ CRÉER LES PRODUITS

1. **Connecte-toi à Stripe Dashboard**
   - https://dashboard.stripe.com

2. **Va dans "Products"** (menu gauche)
   - Clique sur "+ Add product"

3. **Créer le Plan PRO**
   ```
   Name: SID HUD Pro
   Description: Créez et gérez votre app professionnelle
   
   Pricing:
   - Type: Recurring
   - Amount: 299.00 EUR
   - Billing period: Monthly
   
   Features à lister:
   - App illimitée
   - 10,000 utilisateurs
   - Support prioritaire
   - Analytics avancés
   - Exports illimités
   
   Product ID: prod_xxx (garde-le)
   Price ID: price_xxx (IMPORTANT - à mettre dans .env)
   ```

4. **Créer le Plan ENTERPRISE**
   ```
   Name: SID HUD Enterprise
   Description: Solution complète pour grandes équipes
   
   Pricing:
   - Type: Recurring
   - Amount: 599.00 EUR
   - Billing period: Monthly
   
   Features:
   - Tout du Pro +
   - Apps illimitées
   - 100,000 utilisateurs
   - API access
   - Support dédié
   - Formation équipe
   
   Price ID: price_xxx (IMPORTANT - à mettre dans .env)
   ```

### 2️⃣ CRÉER LE COUPON EARLY ADOPTER

1. **Va dans "Coupons"**
   - Products → Coupons → "+ New coupon"

2. **Configuration du coupon**
   ```
   Coupon ID: EARLY_ADOPTER_50
   Type: Percentage discount
   Percent off: 50%
   Duration: Forever (répéter pour toujours)
   
   Limits:
   - Limit to first 1000 redemptions
   - Can be redeemed until: [Date limite]
   ```

### 3️⃣ CONFIGURER LE WEBHOOK

1. **Va dans "Developers" → "Webhooks"**
   - Clique sur "+ Add endpoint"

2. **Configuration endpoint**
   ```
   Endpoint URL: https://ton-domaine.com/api/stripe/webhook
   
   Events to send:
   ✅ checkout.session.completed
   ✅ customer.subscription.created
   ✅ customer.subscription.updated
   ✅ customer.subscription.deleted
   ✅ invoice.payment_succeeded
   ✅ invoice.payment_failed
   ✅ payment_intent.succeeded
   ✅ payment_intent.payment_failed
   ```

3. **Récupère le Signing secret**
   - Commence par `whsec_...`
   - À mettre dans STRIPE_WEBHOOK_SECRET

### 4️⃣ RÉCUPÉRER LES CLÉS API

1. **Va dans "Developers" → "API keys"**

2. **Mode TEST (pour développement)**
   ```
   Publishable key: pk_test_...
   Secret key: sk_test_...
   ```

3. **Mode LIVE (pour production)**
   ```
   Publishable key: pk_live_...
   Secret key: sk_live_...
   ```

### 5️⃣ CONFIGURER PAYMENT METHODS

1. **Settings → Payment methods**
   - ✅ Card payments
   - ✅ SEPA Direct Debit (Europe)
   - ✅ Apple Pay
   - ✅ Google Pay

2. **Settings → Customer emails**
   - ✅ Successful payments
   - ✅ Failed payments
   - Customize emails with your branding

### 6️⃣ VARIABLES D'ENVIRONNEMENT

Ajoute dans ton `.env.local` :

```env
# Stripe TEST (développement)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=pk_test_...
STRIPE_SECRET_KEY_TEST=sk_test_...

# Stripe LIVE (production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID=price_...
```

### 7️⃣ TESTER L'INTÉGRATION

1. **Utilise les cartes de test Stripe**
   ```
   Succès: 4242 4242 4242 4242
   Déclin: 4000 0000 0000 0002
   3D Secure: 4000 0025 0000 3155
   ```

2. **Test du workflow complet**
   - Créer un compte
   - Aller sur /pricing
   - Choisir un plan
   - Payer avec carte test
   - Vérifier webhook reçu
   - Vérifier subscription créée

### 8️⃣ CHECKLIST AVANT PRODUCTION

- [ ] Basculer sur les clés LIVE
- [ ] Vérifier les prix en EUR
- [ ] Tester sur mobile
- [ ] Configurer les emails
- [ ] Activer la détection de fraude
- [ ] Configurer les factures automatiques
- [ ] Backup des webhooks logs

## 🚨 ERREURS COMMUNES

### "Invalid signature" sur webhook
→ Vérifie que STRIPE_WEBHOOK_SECRET correspond bien

### "No such price"
→ Vérifie que les price IDs sont corrects

### "Card declined"
→ En test, utilise 4242 4242 4242 4242

## 📞 SUPPORT

- Documentation: https://stripe.com/docs
- Support: dashboard.stripe.com/support
- Status: status.stripe.com

---

## 🎯 NEXT STEPS

Une fois Stripe configuré :
1. Configure SendGrid pour les emails
2. Configure NextAuth providers
3. Configure la base de données
4. Deploy sur Vercel

---

*Dernière mise à jour : [DATE]*