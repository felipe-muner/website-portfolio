# Vercel Deployment Guide

Complete guide to deploy your gym management system to Vercel with Neon database.

## Quick Overview

1. Push code to GitHub
2. Import to Vercel
3. Create Neon database from Storage tab (automatic integration!)
4. Configure environment variables
5. Run migrations & seed 1000 members
6. Done! 🚀

## Prerequisites

- [ ] Vercel account
- [ ] GitHub repository (push your code first)
- [ ] Google OAuth credentials
- [ ] 15 minutes ⏱️

---

## Step 1: Set Up Neon Database via Vercel

**Easiest Way:** Create Neon database directly from Vercel Storage tab.

1. **Deploy to Vercel first** (see Step 3 below) or go to existing project
2. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Click on **Storage** tab
4. Click **Create Database**
5. Select **Neon Postgres** (Serverless PostgreSQL)
   - Free tier: 10GB storage, 100 hours/month compute
   - Scales automatically
   - No cold starts
6. Choose region (select closest to your users, e.g., `US East`)
7. Click **Create**
8. **Done!** Vercel automatically:
   - Creates the Neon database
   - Adds `DATABASE_URL` to your environment variables
   - Redeploys your app with the new env var

**Important:** After creating the database, you'll see it listed in the Storage tab with connection details.

---

## Step 2: Configure Google OAuth for Production

### Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Add **Authorized redirect URIs**:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```
   Replace `your-domain` with your actual Vercel domain

6. Add **Authorized JavaScript origins** (optional but recommended):
   ```
   https://your-domain.vercel.app
   ```

7. Click **Save**

**Note:** You can use the same Google Client ID/Secret as development, or create new ones for production.

---

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click **Import Project**
   - Select your GitHub repository
   - Click **Import**

3. **Configure Environment Variables** (in Vercel dashboard):

   Click **Environment Variables** and add these:

   ```env
   # Database (auto-added if using Vercel Postgres)
   DATABASE_URL=postgres://...your-production-database-url...

   # Auth Secret (generate new one for production)
   AUTH_SECRET=your-generated-secret-here

   # Google OAuth (get from Google Cloud Console)
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here

   # NextAuth URL (your production domain)
   NEXTAUTH_URL=https://your-domain.vercel.app

   # Initial Admin Email
   INITIAL_ADMIN_EMAIL=felipe.muner@gmail.com
   ```

   **Generate new AUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy**
   - Click **Deploy**
   - Wait for build to complete

---

## Step 4: Run Database Migrations & Seed (1000 Members)

After Neon database is created, you need to set up the schema and seed data.

### Get Your Neon Database URL

1. Go to Vercel → Your Project → **Storage** tab
2. Click on your Neon database
3. Copy the **Connection String** (it will look like: `postgres://...@ep-xxx.neon.tech/...`)
   - Or go to **Settings** → **Environment Variables** and copy `DATABASE_URL`

### Run Migrations & Seed

**Option 1: Easy Script (Recommended)**

We've created a helper script that does everything for you:

```bash
DATABASE_URL="your-neon-database-url-here" ./scripts/seed-production.sh
```

This script will:
- ✅ Push database schema
- ✅ Seed plans and pricing
- ✅ Seed 1000 members with denial cases
- ✅ Verify everything worked

**Option 2: Manual Commands**

Run these commands one by one:

```bash
# 1. Set the production DATABASE_URL temporarily
export DATABASE_URL="your-neon-database-url-here"

# 2. Push database schema (creates all tables)
npx drizzle-kit push

# 3. Seed plans and pricing structure
bun scripts/seed-with-new-pricing.ts

# 4. Seed 1000 members (includes DENIED test cases)
bun scripts/seed-1000-members-presentation.ts
```

**Expected output:**
```
✅ Successfully seeded 186 nationalities
✅ Successfully seeded 21 plans
✅ Successfully seeded 1000 comprehensive members
   🚫 DENIAL TEST CASES: 15
   🎂 Birthday Members: 35
   💪 Active Gym: 150
   🏋️ Active CrossFit: 100
   ... (and more)
```

**⚠️ Important:** Replace `your-neon-database-url-here` with your actual Neon connection string from Vercel!

### Verify Seeding

Check in Vercel → Storage → Your Neon Database → **Data** tab:
- Should see `member` table with 1000 rows
- `plan` table with 21 rows
- `nationality` table with 186 rows
- `admin_user` table with 1 row (your admin)

---

## Step 5: Verify Deployment

1. **Visit your production URL**: `https://your-domain.vercel.app`

2. **Test login**:
   - Go to `/admin/login`
   - Click **Sign in with Google**
   - Use `felipe.muner@gmail.com` (or your INITIAL_ADMIN_EMAIL)
   - Should successfully log in

3. **Test features**:
   - Check members list (should see 1000 members)
   - Search for "DENIED-" to find denial test cases
   - Try check-in with a DENIED member
   - Add payment and retry check-in

---

## Step 6: Configure Custom Domain (Optional)

1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed
5. Update Google OAuth redirect URIs with new domain
6. Update `NEXTAUTH_URL` environment variable

---

## Environment Variables Summary

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Production database connection string | `postgres://user:pass@host/db` |
| `AUTH_SECRET` | NextAuth secret (generate new for prod) | `abc123...` (32+ chars) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789-xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-...` |
| `NEXTAUTH_URL` | Production URL | `https://your-domain.vercel.app` |
| `INITIAL_ADMIN_EMAIL` | Admin email for seeding | `felipe.muner@gmail.com` |

---

## Production Database Schema

Your production database will have:
- ✅ 1000 members with realistic data
- ✅ 15 DENIAL test cases (search: "DENIED-")
- ✅ 35 birthday members
- ✅ All plan types with Thai discounts
- ✅ Payment records
- ✅ Check-in history
- ✅ Day passes
- ✅ Nationalities with flags
- ✅ Admin users

---

## Troubleshooting

### Issue: "Error: Database connection failed"
**Solution:** Check if `DATABASE_URL` is correctly set in Vercel environment variables.

### Issue: "Google OAuth error"
**Solution:**
1. Verify redirect URI is added in Google Console
2. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
3. Ensure `NEXTAUTH_URL` matches your production domain

### Issue: "Cannot sign in / User not authorized"
**Solution:**
1. Make sure you ran the seed script (creates admin user)
2. Verify `INITIAL_ADMIN_EMAIL` matches your Google account
3. Check admin user exists in database:
   ```bash
   # Connect to your production database and run:
   SELECT * FROM admin_user WHERE email = 'felipe.muner@gmail.com';
   ```

### Issue: "No members showing up"
**Solution:** You need to run the seed script. See Step 4.

---

## Re-seeding Database (if needed)

If you need to reset and re-seed:

```bash
# Connect to production database
DATABASE_URL="your-production-url" npm run db:drop
DATABASE_URL="your-production-url" npm run db:push:force
DATABASE_URL="your-production-url" bun scripts/seed-with-new-pricing.ts
DATABASE_URL="your-production-url" bun scripts/seed-1000-members-presentation.ts
```

**⚠️ WARNING:** This will delete all existing data!

---

## Continuous Deployment

Once set up, any push to your `main` branch will automatically deploy to Vercel.

```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys
```

---

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)

---

## Quick Commands Reference

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Pull env vars
vercel env pull

# Deploy
vercel --prod

# Check deployment logs
vercel logs

# Open project in browser
vercel open
```

---

---

## 📋 Deployment Checklist

Use this checklist to ensure everything is set up correctly:

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] Google OAuth configured with production redirect URI
- [ ] Generated new `AUTH_SECRET` for production

### Vercel Setup
- [ ] Project imported to Vercel
- [ ] Neon database created from Storage tab
- [ ] All environment variables added:
  - [ ] `DATABASE_URL` (auto-added by Neon)
  - [ ] `AUTH_SECRET`
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `NEXTAUTH_URL`
  - [ ] `INITIAL_ADMIN_EMAIL`
- [ ] Initial deployment successful

### Database Setup
- [ ] Schema pushed (`drizzle-kit push`)
- [ ] Plans seeded (`seed-with-new-pricing.ts`)
- [ ] 1000 members seeded (`seed-1000-members-presentation.ts`)
- [ ] Verified data in Vercel Storage → Data tab

### Testing
- [ ] Can access production URL
- [ ] Can log in with Google OAuth
- [ ] Members list shows 1000 members
- [ ] Search "DENIED-" finds denial test cases
- [ ] Check-in works for active member
- [ ] Check-in denied for expired member
- [ ] Can add payment and retry check-in

### Presentation Ready! 🎉
- [ ] Shared link with customer
- [ ] Tested demo flow with DENIED cases
- [ ] Everything working smoothly

---

Good luck with your presentation! 🚀

**Pro Tip:** Test the denial scenarios (DENIED-Expired1Month, DENIED-AllVisitsUsed5Pass, etc.) before your presentation to ensure smooth demo flow!
