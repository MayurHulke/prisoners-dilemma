# Firebase App Check Setup Guide

Firebase App Check helps protect your backend resources from abuse by preventing unauthorized clients (bots, scrapers) from accessing your Firebase services.

## Step 1: Enable App Check in Firebase Console

1. Go to https://console.firebase.google.com/
2. Select your project: `prisoners-dilemma-game-97e4e`
3. Click **"App Check"** in the left menu
4. Click **"Get Started"**
5. Select your web app from the list (or register one if you haven't)

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
