#!/bin/bash

# === CONFIGURATION (à adapter) ===
GITHUB_TOKEN="ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXX"  # Ton token GitHub personnel
REPO_OWNER="AtlasCoreUs"
REPO_NAME="Sid"
BRANCH="main"

# === ENVOI D'UN ÉVÉNEMENT FAUX POUR TRIGGER LE WEBHOOK CODEMAGIC ===
echo "🚀 Déclenchement du build Codemagic pour $REPO_NAME..."

curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/dispatches \
  -d '{"event_type":"codemagic_auto_build"}'

echo "✅ Build Codemagic déclenché avec succès depuis Ubuntu 🧠"

