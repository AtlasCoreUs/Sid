#!/bin/bash

echo "🚀 Post-deployment script for SID HUD"

# 1. Vérifier la santé de l'app
echo "Checking app health..."
curl -s https://votre-domaine.com/api/health | jq .

# 2. Initialiser les webhooks Stripe
echo "Setting up Stripe webhooks..."
stripe listen --forward-to https://votre-domaine.com/api/stripe/webhook

# 3. Tester l'authentification
echo "Testing authentication..."
curl -X POST https://votre-domaine.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# 4. Vérifier les Core Web Vitals
echo "Checking performance..."
npx lighthouse https://votre-domaine.com --output json --output-path ./lighthouse-report.json

echo "✅ Post-deployment checks complete!"