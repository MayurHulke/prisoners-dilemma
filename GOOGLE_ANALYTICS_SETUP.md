# Google Analytics 4 (GA4) Setup Guide

Get insights into user behavior, page views, time spent on games, and more!

---

## Step 1: Link Google Analytics to Firebase

Since you already have Firebase, this is easy:

### Option A: Via Firebase Console (Recommended)

1. **Go to Firebase Console**
   - https://console.firebase.google.com/
   - Select project: `prisoners-dilemma-game-97e4e`

2. **Open Project Settings**
   - Click the **gear icon** ⚙️ in the left sidebar
   - Click **"Project settings"**

3. **Navigate to Integrations**
   - Click the **"Integrations"** tab at the top
   - Find **"Google Analytics"**

4. **Link Google Analytics**
   - Click **"Link"** button on Google Analytics card
   - Follow the wizard:
     - **Option 1:** Create a new Google Analytics property (recommended for new users)
     - **Option 2:** Link to existing GA4 property (if you already have one)
   - Choose your analytics account or create new
   - Click **"Enable Google Analytics"**

5. **Get Your Measurement ID**
   - After linking, you'll get a **Measurement ID** like: `G-XXXXXXXXXX`
   - **Copy this!** You'll need it for the next step

---

## Step 2: What Analytics You'll Get

Once set up, you'll see:

### 📊 In Google Analytics Dashboard:

**Real-time Data:**
- Users currently on your site
- Which pages they're viewing
- Geographic location
- Device type (mobile/desktop)

**User Behavior:**
- **Page views** - Which games are most popular?
- **Session duration** - How long do people play?
- **Bounce rate** - Do they leave immediately or explore?
- **User flow** - What path do they take through games?

**Demographics:**
- **Location** - Where are your players from?
- **Device** - Mobile vs desktop usage
- **Browser** - Chrome, Safari, Firefox, etc.

**Engagement:**
- **Games started** - How many begin playing?
- **Games completed** - How many finish all rounds?
- **Return visitors** - Do people come back?

---

## Step 3: Access Your Analytics

**Google Analytics Dashboard:**
- https://analytics.google.com/
- Select your property: "Game Theory Arcade"
- Click **"Reports"** → **"Realtime"** to see live users!

**Common Reports:**
- **Realtime** - Users online right now
- **Acquisition** - How did they find your site?
- **Engagement** - Pages viewed, time spent
- **Demographics** - Age, location, interests
- **Tech** - Devices, browsers, OS

---

## Step 4: Next Steps

After you link Google Analytics in Firebase Console:
1. Come back here
2. Tell me your **Measurement ID** (looks like `G-XXXXXXXXXX`)
3. I'll integrate the tracking code into all your game pages!

---

## 🎯 Quick Summary:

**To do RIGHT NOW:**
1. Go to Firebase Console → Settings ⚙️ → Integrations
2. Click "Link" on Google Analytics
3. Follow the wizard to create/link GA4 property
4. Copy your Measurement ID (G-XXXXXXXXXX)
5. Tell me the ID so I can add tracking code!

Takes about 2 minutes! 🚀
