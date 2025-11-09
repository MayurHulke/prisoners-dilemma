# Firebase App Check Setup Guide

Firebase App Check helps protect your backend resources from abuse by preventing unauthorized clients (bots, scrapers) from accessing your Firebase services.

## Step 1: Find App Check in Firebase Console

**Method 1: Left Sidebar (New Console)**
1. Go to https://console.firebase.google.com/
2. Select your project: `prisoners-dilemma-game-97e4e`
3. Look in the **left sidebar menu** for "App Check" (it's usually under "Build" section)
4. If you don't see it, try clicking "All products" at the bottom of the sidebar

**Method 2: Direct URL**
Just go directly to:
```
https://console.firebase.google.com/project/prisoners-dilemma-game-97e4e/appcheck
```

**Method 3: Settings (Old Console)**
1. Click the **gear icon** ⚙️ (Settings) in the left sidebar
2. Click **"Project settings"**
3. Look for **"App Check"** tab at the top

**If you STILL can't find it:**
- App Check might not be available for your Firebase plan (it requires Blaze/pay-as-you-go plan)
- Your project might need to upgrade from Spark (free) to Blaze plan
- Check if your Firebase SDK is up to date

---

## Step 2: Register Your Web App (if needed)

Before setting up App Check, you need a registered web app:

1. In Firebase Console, click the **gear icon** ⚙️ → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. If you see a web app (</> icon), you're good to go!
4. If not, click **"Add app"** → **"Web"** → Register with nickname "Game Theory Arcade"

## Step 2: Register reCAPTCHA v3

For web apps, we'll use reCAPTCHA v3 (invisible, doesn't interrupt users):

1. In App Check settings, click **"Add provider"**
2. Select **"reCAPTCHA v3"**
3. You'll need a reCAPTCHA v3 site key. Get one here:
   - Go to https://www.google.com/recaptcha/admin/create
   - Choose **reCAPTCHA v3**
   - Add your domain: `mayurhulke.github.io`
   - Submit and copy the **Site Key**
4. Paste the Site Key into Firebase App Check
5. Click **"Save"**

## Step 3: Enforce App Check for Realtime Database

1. Still in App Check settings
2. Find **"Realtime Database"** in the list of services
3. Click the three dots menu → **"Enforce"**
4. Choose **"Enforce for all apps"**

⚠️ **Important:** After enforcing, only requests with valid App Check tokens will work!

## Step 4: Copy the reCAPTCHA Site Key

After setting up, you'll have a reCAPTCHA Site Key that looks like:
`6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

You'll need this for the code integration (next step).

---

## What App Check Does:

✅ **Prevents bot abuse** - Automated scripts can't flood your database
✅ **Invisible to users** - reCAPTCHA v3 runs in background
✅ **Quota protection** - Prevents malicious quota exhaustion
✅ **No authentication required** - Users don't need to sign up

## What It Doesn't Do:

❌ Doesn't prevent legitimate users from playing multiple times
❌ Doesn't validate data quality (Firebase rules handle that)
❌ Doesn't replace authentication for personalized features

---

**Once you complete these steps, let me know and I'll integrate App Check into your code!**
