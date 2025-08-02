# 📧 CONFIGURATION SENDGRID (EMAILS)

## OPTION SIMPLE : SANS SENDGRID

Si tu veux lancer sans emails pour l'instant, c'est possible !
Les notifications apparaîtront dans l'app directement.

## AVEC SENDGRID (Recommandé)

1. **Créer compte**
   - https://sendgrid.com
   - Free tier : 100 emails/jour

2. **Créer API Key**
   - Settings → API Keys → Create
   - Full Access

3. **Vérifier domaine**
   - Settings → Sender Authentication
   - Verify Single Sender (plus simple)

4. **Variables .env**
   ```env
   SENDGRID_API_KEY=SG.xxx
   SENDGRID_FROM_EMAIL=hello@ton-domaine.com
   ```

---

*Tu peux configurer ça plus tard !*