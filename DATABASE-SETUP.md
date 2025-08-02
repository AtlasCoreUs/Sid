# 📊 CONFIGURATION BASE DE DONNÉES POUR SID HUD

## 🎯 OPTIONS RECOMMANDÉES

### Option 1 : SUPABASE (Recommandé - Gratuit pour commencer)

1. **Créer un compte**
   - https://supabase.com
   - Sign up avec GitHub

2. **Créer un nouveau projet**
   ```
   Organization: [ton nom]
   Project name: sid-hud
   Database Password: [génère un fort]
   Region: Europe (Frankfurt)
   ```

3. **Récupérer l'URL**
   - Settings → Database
   - Connection string → URI
   ```
   postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   ```

4. **Configure Prisma**
   ```env
   DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
   ```

### Option 2 : RAILWAY (Simple et scalable)

1. **Créer un compte**
   - https://railway.app

2. **New Project → Deploy PostgreSQL**

3. **Récupère les credentials**
   - Click sur PostgreSQL
   - Connect → Connection URL

### Option 3 : NEON (Performance optimale)

1. **Créer un compte**
   - https://neon.tech

2. **Create database**
   ```
   Project name: sid-hud
   Region: Europe
   ```

3. **Connection string**
   - Dashboard → Connection Details

## 🚀 SETUP INITIAL

Une fois la DB configurée :

```bash
# 1. Installe les dépendances
npm install

# 2. Génère le client Prisma
npx prisma generate

# 3. Pousse le schema
npx prisma db push

# 4. (Optionnel) Seed initial data
npx prisma db seed
```

## 🔧 COMMANDES UTILES

```bash
# Voir la DB dans un GUI
npx prisma studio

# Reset la DB (attention!)
npx prisma migrate reset

# Créer une migration
npx prisma migrate dev --name init
```

## 🚨 SÉCURITÉ

- Ne JAMAIS commit DATABASE_URL
- Utilise des connexions SSL en prod
- Active Row Level Security si Supabase
- Backup quotidien automatique

---

*Dernière mise à jour : [DATE]*